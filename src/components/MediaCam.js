import React, { useEffect, useRef, useState } from "react";
import { styled, IconButton } from "@mui/material";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { Circle, Close } from "@mui/icons-material";
import MaskBox from "./MaskBox";
import useDrag from '../hooks/useDrag'
import Hls from 'hls.js'
import axios from "axios";



const MediaCam = ({ type }) => {

  const { cityName, cameraURL, cameraDesc, isMobile, serverURL, setVideoRef, setCameraURL } = useStore()
  const [ isLoading, setIsLoading ] = useState(true)
  const ref = useRef(null)

  console.log(isLoading)
  
  useDrag('RootBox', true)

  const options = {
    ref: ref,
    ismobile: Number(isMobile),
    loading: 'lazy',
    media: type,
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.src = cameraURL
      setIsLoading(true)
      setVideoRef(ref)
    }
  }, [ref, type, cameraURL, setVideoRef, setIsLoading, isMobile])

  // 處理iframe
  useEffect(() => {
    if (type === 'iframe' && cameraURL && ref.current) {
      if (ref.current.contentDocument || ref.current.contentWindow) {
        setIsLoading(false)
      }
    }
  } ,[type, ref, cameraURL])

  // 處理.m3u8
  useEffect(() => {
    let hlsPlayer
    if (cityName === 'YilanCounty') {
      hlsPlayer = new Hls()
      hlsPlayer.loadSource(cameraURL)
      hlsPlayer.attachMedia(ref.current)
    }
    return () => {
      cityName === 'YilanCounty' && hlsPlayer.destroy()
    }
  }, [type, cameraURL, ref, cityName])

  // 定義closeBTN函數
  const closeBTN = () => {
    setCameraURL(null)
    axios(`${serverURL}/close`)
  }

  return (
    <RootBox 
      id='RootBox' 
      media={type}
      ismobile={Number(isMobile)} 
    >
      <TitleBox ismobile={Number(isMobile)} isloading={Number(isLoading)}>
        <div className='top-bar'>
          <Circle/>
          <p>{ cameraDesc.t1 ? cameraDesc.t1 : cameraDesc.t2 ? cameraDesc.t2 : ' --- ' }</p>
        </div>

        <IconButton 
          onClick={() => closeBTN()}
          onTouchStart={() => closeBTN()}
        >
          <Close sx={{fontSize: isMobile ? '1.2rem' : '1.5rem'}}/>
        </IconButton>
      </TitleBox>

      <div className="CCTV-Box">
        
        { isLoading &&  <MaskBox/> }
        
        { type === 'img' && 
          <img 
            alt=''
            onLoad={() => setIsLoading(false)} 
            {...options}
          /> 
        }

        { type === 'iframe' &&
            <iframe 
              title='iframeCam'
              style={{'pointerEvents': 'none'}}
              onLoad={() => setIsLoading(false)} 
              {...options} 
            /> 
        }

        { type === 'video' && 
          <video 
            autoPlay
            controls
            playsInline
            onLoadedData={() => setIsLoading(false)}
            style={{background: 'black'}}
            {...options}
          /> 
        }
        
      </div>
    </RootBox>
  )
}

export default observer(MediaCam)


const RootBox = styled('div')(({ismobile, media}) => `
  z-index: 90;
  position: absolute;
  height: auto;
  top: ${ismobile? '50%' : '3%'};
  left: ${ismobile? '3%' : '5%'};
    .CCTV-Box {
      position: relative;
      width: ${ismobile? '350px' : '500px'};
      height: ${ismobile? '250px' : '350px'};
    }
    ${media} {
      width: ${ismobile? '350px' : '500px'};
      height: ${ismobile? '250px' : '350px'};
    }
`)

const TitleBox = styled('div')(({ismobile, isloading, theme}) => ` 
  width: ${ismobile? '350px' : '500px'};
  height: ${ismobile ? '25px' : '40px'};
  background: ${theme.palette.menubar.main};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.palette.menubar.font};
  padding: 0 0 0 10px;
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
        p {
          width: ${ismobile ? '200px' : '350px'};
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        svg {
          font-size: ${ismobile ? '10px' : '14px'};
          margin-right: 10px;
          color: ${isloading ? 'rgb(255,0,33)' : 'rgb(0,248,65)'};
        }
    }
`)