import React, { useEffect, useRef, useState } from "react"
import { styled } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useStore } from "../store/store"
import { observer } from "mobx-react-lite"
import { LocationOn } from '@mui/icons-material'



const AutoComplete = () => {

  console.log('auto')
  const { bounds, map, setSearchData } = useStore()
  const [ dataArr, setDataArr ] = useState(null)
  const [ sessionToken, setSessionToken ] = useState(null)
  const [ service, setService ] = useState(null)
  const [ placesService, setPlacesService ] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    map && setPlacesService(new window.google.maps.places.PlacesService(map))
    setSessionToken(new window.google.maps.places.AutocompleteSessionToken())
    setService(new window.google.maps.places.AutocompleteService())
  }, [map])

  const getPrediction = (value) => {
      if (value) {
        let queryOption = {
            input: value,
            bounds: bounds,
            sessionToken 
        }
        service.getQueryPredictions(queryOption, (prediction) => {
            console.log(prediction)
            prediction && setDataArr(prediction)
        })
    } else {
        setDataArr(null)
    }
  }
  
  const getResponse = (item) => {
    let request = { 
      query: item?.description || inputRef.current.value, 
      openNow: false
    }
    placesService.textSearch(request, (results) => {
        console.log(results)
        const viewport = new window.google.maps.LatLngBounds()
        results?.forEach( place => {
          if (place.geometry.viewport) {
            viewport.union(place.geometry.viewport)
          } else {
            viewport.extend(place.geometry.location)
          }
          item.opening_hours = null
          delete item.permanently_closed
        })

        inputRef.current.value = ''
        setDataArr(null)
        setSearchData(results.filter(item => item.photos))
        map.fitBounds(viewport)
    })
  }

  return (
    <RootBox>
        <Search/>
        <input 
            ref={inputRef}
            onChange={(e) => getPrediction(e.target.value)}
        />
        { dataArr &&
            <PredictionBox>
                { dataArr.map((item, i) => 
                    <div className='text-box' key={i} onClick={() => getResponse(item)}>
                        { item.types ? <LocationOn/> : <Search/> }
                        <div>
                            <p className='title'>{item.structured_formatting.main_text}</p>
                            <p className='address'>{item.structured_formatting.secondary_text}</p>
                        </div>
                    </div>
                )}
            </PredictionBox>
        }
    </RootBox>
  )
}

export default observer(AutoComplete)

const RootBox = styled('div')`
    width: 200px;
    position: relative;
    input {
        width: 200px;
        height: 30px;
        border-radius: 5px;
        padding: 5px 0 5px 30px;
        border: none;
        font-size: 20px;
    }
    svg {
        position: absolute;
        top: 20%;
        left: 3%;
        color: gray;
        font-size: 20px;
    }
`

const PredictionBox = styled('div')`
    width: 200px;
    padding: 10px;
    background: rgb(255,255,255);
    border-radius: 0 0 5px 5px;
    position: absolute;
    top: 100%;
    cursor: pointer;
        .text-box {
            width: 100%;
            display: flex;
            align-items: center;
            height: 40px;
            margin: 5px 0;
            gap: 10px;
            svg {
                position: unset;
            }
            .title {
                font-size: 16px;
                color: black;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 0;
                margin: 0;
            }
            div {
                width: 85%;
                .address {
                    font-size: 14px;
                    color: gray;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding: 0;
                    margin: 0;
                }
            }
        }
`