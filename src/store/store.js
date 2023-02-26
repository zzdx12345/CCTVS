import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'

class Store {

  constructor() {
    makeAutoObservable(this)
  }

  cameraURL = null
  cityName = null
  mode = true
  token = null
  selected = null
  map = null
  videoRef = null

  setMap = act => this.map = act
  setToken = act => this.token = act
  setMode = act => this.mode = act
  setSelected = act => this.selected = act
  setVideoRef = act => this.videoRef = act
  setCameraURL  = act => {
    if (act === null) {
      this.videoRef.current.src = null
      console.log('connection down')
      this.cameraURL = act
    } else {
      this.cameraURL = act
    }
  }
  setCityName = act => {
    if (this.videoRef) {
      this.videoRef.current.src = null
    }
    this.cityName = act
    this.cameraURL = null
    this.selected = null
  }

}

const store = new Store()
const context = createContext(store)
export const useStore = () => useContext(context)