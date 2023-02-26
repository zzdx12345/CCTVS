import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { dark, light } from "./theme/theme.js";
import { useLoadScript } from '@react-google-maps/api'
import { observer } from "mobx-react-lite";
import Map from './views/Map.js'
import Menubar from "./components/Menubar.js";
import ImgCam from "./components/ImgCam.js";
import IframeCam from "./components/IframeCam.js";
import VideoCam from './components/VideoCam.js'
import Fabs from "./components/Fabs.js"
import { useStore } from "./store/store.js";



const App = () => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY
  })
  
  const { cameraURL, mode, cityName } = useStore()
  const theme = createTheme(mode? light : dark)
  console.log(cameraURL)
  console.log(cityName)

  return (
    <ThemeProvider theme={theme}>
      <div style={{position: 'relative'}}>
        { isLoaded && <Map/> }
        { cameraURL && switchPlayer(cityName) }
        <Menubar/>
        <Fabs/>
      </div>
    </ThemeProvider>
  )
}

const switchPlayer = (cityName) => {
  switch (cityName) {
    case 'Taipei': 
      return <IframeCam/>
    case 'NewTaipei':
      return <VideoCam/>
    case 'PingtungCounty': 
      return <IframeCam/>
    case 'YunlinCounty':
      return <IframeCam/>
    default: 
      return <ImgCam/>
  }
}

export default observer(App)