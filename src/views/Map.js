import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { dark } from "../theme/darkMap"
import axios from "axios";
import * as qs from 'qs'
import Rainning from "../components/Rainning";



const Map = (props) => {

  // 定義變量
  const [ center, setCenter ] = useState(null)
  const [ data, setData ] = useState([])
  const [ rainningArr, setRainningArr ] = useState([])
  const [ popupInfo, setPopupInfo ] = useState(null)
  const { map, token, cityName, mode, selected, zoomed, searchData, serverURL } = useStore()
  const { setCameraURL, setCameraDesc, setToken } = useStore()
  const { setSelected, setMap, setZoomed, setBounds } = useStore()

  // GoogleMap參數
  const options = useMemo(()=>({
    disableDefaultUI: true,
    gestureHandling: "greedy",
    styles: mode? '' : dark 
  }),[mode])

  // useEffect取得用戶位置 & 設定地圖初始位置
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({ coords })=>{
      setCenter({ lat: coords.latitude, lng: coords.longitude })
    })
  },[])

  // 取得天氣資料
  useEffect(() => {
    axios(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${process.env.REACT_APP_WEATHER_KEY}&elementName=Weather`)
    .then(res => {
      let arr = []
      console.log(res.data)
      res.data.records.location.forEach(item => {
        if (item.weatherElement[0].elementValue.includes('雨')) {
          arr.push({
            locationName: item.locationName,
            lat: item.lat,
            lon: item.lon,
            weather: item.weatherElement[0].elementValue
          })
        }
      })
      setRainningArr(arr)
    })
  }, [])

  // useEffect取得token & 取得TDX縣市CCTV
  useEffect(() => {
    // 取得token
    !token && axios({
      method: 'POST',
      url: 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        grant_type:"client_credentials",
        client_id: process.env.REACT_APP_TDX_KEY,
        client_secret: process.env.REACT_APP_TDX_VAL
      }),
    }).then(res => setToken(res.data.access_token))

    // edgeCase
    if (cityName === 'YilanCounty') {
      console.log(111)
      axios(`${serverURL}/cities?cityName=YilanCountry`).then(res => setResData(res, setData, map))
    } 
    
    // 取得response
    else {
      token && cityName && axios({
        url: `https://tdx.transportdata.tw/api/basic/v2/Road/Traffic/CCTV/City/${cityName}?%24top=1000&%24format=JSON`,
        headers: { "authorization": `Bearer ${token}` }
      }).then(res => setResData(res, setData, map))
    }
  },[token, cityName, map, serverURL, setToken])

  // 渲染CCTV座標 && 設置viewport
  const setResData = (res, setData, map) => {
    if (!searchData) {
      const view = new window.google.maps.LatLngBounds()
      res.data.CCTVs.forEach(item => view.extend({lat: Number(item.PositionLat), lng: Number(item.PositionLon)}))
      map.fitBounds(view)
    }
    setData(res.data.CCTVs)
  }

  // 取得CCTV資源
  const getVideoSource = (item, cityName) => {

    console.log(cityName)
    console.log(item.VideoStreamURL)

    if (['Taipei', 'ChanghuaCounty', 'YunlinCounty'].includes(cityName)) {
      setCameraURL(item.VideoStreamURL)
      setCameraDesc({t1: item.RoadName, t2: item.SurveillanceDescription})
    }
    else if (['YilanCounty'].includes(cityName)) {
      const did = item.did
      axios(`https://ilcpb.ivs.hinet.net/public/ajaxGetStream?did=${did}&page=ilcpb`)
      .then(res => {
        setCameraURL(res.data.data[0].camurl)
        setCameraDesc({t1: item.RoadName, t2: item.SurveillanceDescription})
      })
    }
    else {
      setCameraURL(`${serverURL}/api?cityName=${cityName}&url=${item.VideoStreamURL}`)
      setCameraDesc({t1: item.RoadName, t2: item.SurveillanceDescription})
    }

    setSelected(item.CCTVID)
  }

  return (
    <GoogleMap 
      zoom={10}
      mapContainerStyle={{ width: '100vw', height: '100vh' }}
      center={center}
      options={options}
      onZoomChanged={() => map && setZoomed(map.zoom)}
      onLoad={(map) => setMap(map)}
      onBoundsChanged={() => setBounds(map.getBounds())}
    >
      { data?.map(item =>
        <Marker
          key={item.CCTVID}
          position={{lat: Number(item.PositionLat), lng: Number(item.PositionLon)}}
          onClick={() => getVideoSource(item, cityName)}
          icon={{ 
            url: selected === item.CCTVID ? 
            require('../static/markers/live64.png') :
            require('../static/markers/live32.png') 
          }}
        />
      )}

      { props.children }

      { searchData?.map(item =>
        <InfoWindow
          key={item.place_id}
          position={{ lat: item.geometry.location.lat(), lng: item.geometry.location.lng() }}
        >
          <>
            <div
              key={item.place_id} 
              onClick={() => setPopupInfo(item.place_id)}
            >
              {item.name}
            </div>
            { popupInfo === item.place_id && 
              <img 
                src={item.photos[0].getUrl()} 
                style={{width: '200px'}}
                onClick={() => setPopupInfo(null)}
                alt=''
              /> 
            }
          </>
        </InfoWindow>  
      )}

      { zoomed <= 13 && rainningArr?.map((item, i) => 
        <Rainning key={i} item={item}/> 
      )}
    </GoogleMap>
  )
}


export default observer(Map)
