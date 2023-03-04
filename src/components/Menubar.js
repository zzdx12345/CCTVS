import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { AppBar, styled, IconButton } from "@mui/material";
import { Search, DarkMode, VideoCameraBack, AccountCircle } from '@mui/icons-material'
import AutoComplete from './AutoComplete'


const Menubar = () => {

  const { setCameraURL, setMode, isMobile } = useStore()
  const { mode, cameraURL } = useStore()

  return(
    <RootBox ismobile={Number(isMobile)}>
      
      { isMobile ?
        <AutoComplete/>
        :
        <>
        <IconButton
          onClick={() => {}}
        >
          <Search/>
        </IconButton>

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
        </>
      }
      
    
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
  top: ${ismobile? '5%' : 0};
  bottom: ${ismobile? 'unset': 'unset'};
  background: ${theme.palette.menubar.main};
`)

export default observer(Menubar)