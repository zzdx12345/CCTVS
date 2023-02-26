import { useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from '@mui/material'

const useDrag = (id) => {

  const isClicked = useRef(false);
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  useEffect(() => {

    const target = document.getElementById(id);
    console.log(target)

    if (!target) throw new Error("Element with given id doesn't exist");

    const container = target.parentElement;
    if (!container) throw new Error("target element must have a parent");

    const onMouseDown = (e) => {
      isClicked.current = true;
      e.preventDefault()
      e.stopPropagation()
    }

    const onMouseUp = (e) => {
      isClicked.current = false;
      e.preventDefault()
      e.stopPropagation()
    }

    const onMouseMove = (e) => {
      e.preventDefault()
      if (isClicked.current) {
        console.log('moving')
        target.style.top = `${e.clientY - 200}px`;
        target.style.left = `${e.clientX - 250}px`;
      }
    }

    const onTouchMove = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (isClicked.current) {
        console.log('moving')
        target.style.top = `${e.changedTouches[0].clientY - 100}px`;
        target.style.left = `${e.changedTouches[0].clientX - 150}px`;
      }
    }

    
    target.addEventListener(isMobile? 'touchstart' : 'mousedown', onMouseDown)
    target.addEventListener(isMobile? 'touchend' : 'mouseup', onMouseUp)
    target.addEventListener(isMobile? 'touchmove' : 'mousemove', isMobile? onTouchMove : onMouseMove)

    const cleanup = () => {
      target.onmousedown =  null
      target.onmouseup =  null
      target.onmousemove =  null
    }

    return cleanup;
  }, [id, isMobile])

}

export default useDrag;