import React, { useEffect, useRef, useState } from "react";
import { styled, useMediaQuery, useTheme } from "@mui/material";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { Close } from "@mui/icons-material";
import useDrag from '../hooks/useDrag'




const ImgCam = () => {

  const { cameraURL, setVideoRef, setCameraURL } = useStore()
  const [ isLoading, setIsLoading ] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const imgRef = useRef(null)
  console.log(isMobile)

  useDrag('RootBox')

  useEffect(() => {
    imgRef.current.src = cameraURL
    setVideoRef(imgRef)
  }, [cameraURL])

  return (
    <RootBox id='RootBox' ismobile={Number(isMobile)}>
      <div style={{position: 'relative'}}>
        
        { isLoading && <MaskBox ismobile={Number(isMobile)}>Loading...</MaskBox>}
        
        <img 
          onLoad={() => setIsLoading(false)}
          ref={imgRef}
          ismobile={Number(isMobile)}
          alt=''
          loading='lazy'
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

export default observer(ImgCam)


const RootBox = styled('div')((props) => `
  width: ${props.ismobile? '330px' : '500px'};
  height: ${props.ismobile? '250px' : '350px'};
  z-index: 90;
  position: absolute;
  top: ${props.ismobile? '65%' : '3%'};
  left: ${props.ismobile? '12%' : '5%'};
    img {
      width: ${props.ismobile? '330px' : '500px'};
      height: ${props.ismobile? '250px' : '350px'};
    }
`)

const MaskBox = styled('div')((props) =>`
  width: ${props.ismobile? '330px' : '500px'};
  height: ${props.ismobile? '250px' : '350px'};
  z-index: 100;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
  font-size: 30px;
`)

const CloseBtn = styled('div')((props) => `
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
  top: ${props.ismobile? '-7%' : '-7%'};
  right: ${props.ismobile? '-4%' : '-4%'};
`)