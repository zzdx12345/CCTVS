import React, { useEffect, useRef, useState } from "react";
import { styled, IconButton } from "@mui/material";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { Circle, Close } from "@mui/icons-material";
import MaskBox from "./MaskBox";
import useDrag from '../hooks/useDrag'
import flvjs from 'flv.js'



const MediaCam = ({ type }) => {

  const { cameraURL, cameraDesc, isMobile, setVideoRef, setCameraURL } = useStore()
  const [ isLoading, setIsLoading ] = useState(true)

  let ref = useRef(null)
  console.log(isLoading)

  useDrag('RootBox')

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

  // 處理.flv
  useEffect(() => {
    let flvPlayer
    if (type === 'video') {
      flvPlayer = flvjs.createPlayer({ type: 'flv', url: cameraURL })
      flvPlayer.attachMediaElement(ref.current);
      flvPlayer.load();
    }
    return () => {
      type === 'video' && flvPlayer.destroy()
    }
  }, [type, cameraURL, ref])

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

        <IconButton onClick={() => setCameraURL(null)} onTouchStart={() => setCameraURL(null)}>
          <Close sx={{fontSize: isMobile ? '1.2rem' : '1.5rem'}}/>
        </IconButton>
      </TitleBox>

      <div className="videoBox">
        
        { isLoading && type !== 'video' && <MaskBox/> }
        
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
    .videoBox {
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