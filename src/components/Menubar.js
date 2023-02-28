import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { AppBar, styled, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { Search, DarkMode, VideoCameraBack, AccountCircle } from '@mui/icons-material'


const Menubar = () => {

  const { setCameraURL, setMode} = useStore()
  const { mode, cameraURL } = useStore()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return(
    <RootBox ismobile={Number(isMobile)}>
      <IconButton><Search/></IconButton>
      
      <IconButton 
        onClick={() => setCameraURL(null)}
        sx={{color: cameraURL? 'rgb(30,155,255)' : ''}}
      >
        <VideoCameraBack/>
      </IconButton>
      
      <IconButton 
        onClick={() => setMode(!mode)}
        sx={{color: !mode? 'rgb(30,155,255)' : ''}}
      >
        <DarkMode/>
      </IconButton>

      <IconButton><AccountCircle/></IconButton>
    
    </RootBox>
  )
}

const RootBox = styled(AppBar)(({ismobile, theme}) => `
  margin: auto;
  width: ${ismobile? '90vw' : '40px'};
  height: ${ismobile? '50px' : '100vh'};
  padding: ${ismobile? '0 5px' : '40px 0'};
  display: flex;
  justify-content: space-around;
  flex-direction: ${ismobile? 'row' : 'column'};
  align-items: center;
  position: absolute;
  left: 0;
  right: ${ismobile? 0 : 'unset'};
  top: ${ismobile? 'unset' : 0};
  bottom: ${ismobile? '12%': 'unset'};
  background: ${theme.palette.menubar.main};
`)

export default observer(Menubar)