import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { dark } from "../theme/darkMap"
import axios from "axios";
import * as qs from 'qs'
import VideoCam from "../components/VideoCam";



const Map = (props) => {

  // 定義變量
  const [center, setCenter] = useState(null)
  const [data, setData] = useState([])
  const { map, token, cityName, mode, selected } = useStore()
  const { setCameraURL, setToken, setSelected, setMap } = useStore()

  // GoogleMap參數
  const options = useMemo(()=>({
    disableDefaultUI: true,
    gestureHandling: "greedy",
    styles: mode? '' : dark 
  }),[mode])

  // useEffect取得用戶位置 & 設定地圖初始位置
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({ coords })=>{
      setCenter({lat: coords.latitude, lng: coords.longitude})
    })
  },[])

  // useEffect取得token & 取得TDX縣市data
  useEffect(() => {

    // 取得token
    !token && axios({
      method: 'POST',
      url: 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type:"client_credentials",
        client_id: process.env.REACT_APP_TDX_KEY,
        client_secret: process.env.REACT_APP_TDX_VAL
      }),
    }).then(res => setToken(res.data.access_token))

    // 取得response
    token && cityName && axios({
      url: `https://tdx.transportdata.tw/api/basic/v2/Road/Traffic/CCTV/City/${cityName}??%24top=1000&%24format=JSON`,
      headers: {
        "authorization": `Bearer ${token}`
      }
    }).then(res => setResData(res, setData, map))

  },[token, setToken, cityName, map])


  return (
    <GoogleMap 
      mapContainerStyle={{width: '100vw', height: '100vh'}}
      center={center}
      zoom={12}
      options={options}
      onLoad={(map) => setMap(map)}
    >
      {data?.map(item =>
        <Marker
          key={item.CCTVID}
          position={{lat: Number(item.PositionLat), lng: Number(item.PositionLon)}}
          icon={{
            url: selected === item.CCTVID ? 
            require('../static/markers/ylw64 - location.png') :
            require('../static/markers/red32 - location.png') 
          }}
          onClick={() => {
            getResponse(item, cityName, setCameraURL)
            setSelected(item.CCTVID)
          }}
        />
      )}
      {props.children}
    </GoogleMap>
  )
}


const getResponse = (item, cityName, setCameraURL) => {
  
  console.log(cityName)
  console.log(item.VideoStreamURL)

  switch (cityName) {
    case 'Taipei':
      setCameraURL(item.VideoStreamURL)
      break
    case 'NewTaipei':
      setCameraURL(`http://localhost:5000/api?cityName=${cityName}&url=${item.VideoStreamURL}`)
      break
    case 'Taichung':
      axios(`http://localhost:5000/api?cityName=${cityName}&url=${item.VideoStreamURL}`)
      .then(res => setCameraURL(res.data))
      break    
    case 'ChanghuaCounty':
      setCameraURL(item.VideoStreamURL)
      break
    case 'YunlinCounty':
      setCameraURL(item.VideoStreamURL)
      break
    case 'PingtungCounty':
      setCameraURL(item.VideoStreamURL)
      break
    default:
      setCameraURL(`http://localhost:5000/api?cityName=${cityName}&url=${item.VideoStreamURL}`)
  }
}


const setResData = (res, setData, map) => {
  const view = new window.google.maps.LatLngBounds()
  res.data.CCTVs.forEach(item => {
    view.extend({lat: Number(item.PositionLat), lng: Number(item.PositionLon)})
  });
  map.fitBounds(view)
  setData(res.data.CCTVs)
}

export default observer(Map)
