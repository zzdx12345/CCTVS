import React from 'react'
import { Fab, styled, useMediaQuery, useTheme } from "@mui/material";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { Close } from "@mui/icons-material";


const IframeCam = () => {

    const { cameraURL, setCameraURL } = useStore()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))


    return (
        <RootBox>
            <div style={{position: 'relative'}}>
                <iframe src={cameraURL} 
                    style={{width: '500px', height: '300px'}}
                    // allowFullScreen
                    scrolling='no'
                />
                {/* <Fab size="small" onClick={() => setSelect(null)}>
                  <Close/>
                </Fab> */}
            </div>
        </RootBox>
    )
}

export default observer(IframeCam)

const RootBox = styled('div')`
  z-index: 90;
  position: absolute;
  top: 3%;
  left: 5%;
  iframe {
    width: 450px;
    height: 350px;
    background-size: cover;
  }
  button {
    position: absolute;
    top: -7%;
    right: -4%;
    background: rgba(220,220,220,0.6)
  }
`