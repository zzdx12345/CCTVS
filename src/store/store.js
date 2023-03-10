import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'

class Store {

  constructor() {
    makeAutoObservable(this)
  }

  cameraURL = null
  cameraDesc = null
  cityName = null
  mode = true
  isMobile = false
  token = null
  selected = null
  map = null
  videoRef = null
  menu = false
  zoomed = null
  isMapDragging = false
  bounds = null
  searchData = null
  serverURL = null
  isPopup = false

  setMap = act => this.map = act
  setToken = act => this.token = act
  setMode = act => this.mode = act
  setIsMobile = act => this.isMobile = act
  setMenu = act => this.menu = act
  setSelected = act => this.selected = act
  setVideoRef = act => this.videoRef = act
  setCameraDesc = act => this.cameraDesc = act
  setZoomed = act => this.zoomed = act
  setIsMapDragging = act => this.isMapDragging = act
  setBounds = act => this.bounds = act
  setSearchData = act => this.searchData = act
  setServerURL = act => this.serverURL = act
  setIsPopup = act => this.isPopup = act
  setCameraURL  = act => {
    if (act === null) {
      this.videoRef && ( this.videoRef.current.src = null )
      this.cameraURL = act
      console.log('connection down')
    } 
    this.cameraURL = act
  }
  setCityName = act => {
    this.videoRef && ( this.videoRef.current.src = null )
    this.cityName = act
    this.cameraURL = null
    this.selected = null
  }

}

const store = new Store()
const context = createContext(store)
export const useStore = () => useContext(context)