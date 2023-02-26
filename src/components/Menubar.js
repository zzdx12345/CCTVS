import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { AppBar, styled, IconButton } from "@mui/material";
import { Search, DarkMode, VideoCameraBack, AccountCircle } from '@mui/icons-material'


const Menubar = () => {

  const {setCameraURL, setMode} = useStore()
  const { mode, cameraURL } = useStore()
  return(
    <RootBox>
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

const RootBox = styled(AppBar)(({theme}) => `
  width: 40px;
  height: 100vh;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0 20px 0;
  left: 0;
  background: ${theme.palette.menubar.main};
`)

export default observer(Menubar)