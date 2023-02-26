import React, { useState, useEffect, useRef } from 'react'
import { styled, useMediaQuery, useTheme } from "@mui/material";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { Close } from "@mui/icons-material";
import MaskBox from './MaskBox';
import useDrag from '../hooks/useDrag';


const IframeCam = () => {

    const [ isLoading, setIsLoading ] = useState(true)
    const { cityName, cameraURL, setVideoRef, setCameraURL } = useStore()
    const iframeRef = useRef(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    useDrag('RootBox')

    useEffect(() => {
      iframeRef.current.src = cameraURL
      console.log(cameraURL)
      setIsLoading(true)
      setVideoRef(iframeRef)
    }, [cameraURL, setIsLoading, setVideoRef])

    return (
      <RootBox 
        id='RootBox'
        ismobile={Number(isMobile)}
      >
        <div style={{position: 'relative'}}>
          { isLoading && cityName !== 'PingtungCounty' && <MaskBox ismobile={Number(isMobile)}/> }
          
          <iframe
            title='iframeCam'
            ref={iframeRef}
            loading='lazy'
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />

          { !isMobile &&
            <CloseBtn onClick={() => setCameraURL(null)} ismobile={Number(isMobile)}>
              <Close/>
            </CloseBtn>
          }
        </div>
      </RootBox>
    )
}

export default observer(IframeCam)


const RootBox = styled('div')(({ismobile}) => `
  width: ${ismobile? '300px' : '500px'};
  height: ${ismobile? '250px' : '350px'};
  z-index: 90;
  position: absolute;
  top: ${ismobile? '55%' : '3%'};
  left: ${ismobile? '10%' : '5%'};
    iframe {
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${ismobile? '300px' : '500px'};
      height: ${ismobile? '250px' : '350px'};
      pointer-events: none;
    }
`)

const CloseBtn = styled('div')(({ismobile}) => `
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(200,200,200,0.6);
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255,255,255,0.8);
  position: absolute;
  top: ${ismobile? '-7%' : '-7%'};
  right: ${ismobile? '-4%' : '-4%'};
  cursor: pointer;
`)