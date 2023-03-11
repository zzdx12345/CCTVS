import React, { useEffect, useState } from "react"
import { createTheme, ThemeProvider, useTheme, useMediaQuery } from "@mui/material"
import { dark, light } from "./theme/theme.js"
import { useLoadScript } from '@react-google-maps/api'
import { observer } from "mobx-react-lite"
import Map from './views/Map.js'
import Menubar from "./components/Menubar.js"
import Fabs from "./components/Fabs.js"
import { useStore } from "./store/store.js"
import MediaCam from "./components/MediaCam.js"
import Vconsole from 'vconsole'
import MobFabs from "./components/MobFabs.js"


const libraries = ['places']

const App = () => {
  
  const [ type, setType ] = useState(null)
  const { cameraURL, mode, cityName, setIsMobile, setServerURL } = useStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const themeMode = createTheme(mode? light : dark)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
    libraries: libraries
  })

  useEffect(() => {
    setServerURL(process.env.REACT_APP_VM_URL)
  }, [setServerURL])

  useEffect(() => {
    isMobile && new Vconsole()
    setIsMobile(isMobile)
  }, [isMobile, setIsMobile])

  useEffect(() => {
    if (['Taipei', 'PingtungCounty', 'YunlinCounty'].includes(cityName)) {
      setType('iframe')
    }
    else if (['NewTaipei', 'YilanCounty'].includes(cityName)) {
      setType('video')
    }
    else {
      setType('img')
    }
  }, [cityName])

  console.log(cameraURL)
  console.log(cityName)
  
  return (
    <ThemeProvider theme={themeMode}>
      <div style={{position: 'relative'}}>
        { isLoaded && <Map/> }
        { cameraURL && <MediaCam type={type}/> }
        { isLoaded && <Menubar/> }
        { isMobile ? <MobFabs/> : <Fabs/> }
      </div>
    </ThemeProvider>
  )
}


export default observer(App)
