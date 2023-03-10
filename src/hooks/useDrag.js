import { useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from '@mui/material'

const useDrag = (id) => {

  const isClicked = useRef(false);
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {

    const target = document.getElementById(id);
    console.log(target)

    if (!target) throw new Error("Element with given id doesn't exist");

    const container = target.parentElement;
    if (!container) throw new Error("target element must have a parent");

    const onMouseDown = (e) => {
      // 實現點擊位置在元素寬高的80%內, 才觸發
      const width = target.clientWidth
      const height = target.clientHeight
      const { left, top } = e.target.getBoundingClientRect()
      console.log(width, height)

      // 手機模式下
      if (isMobile) {
        if (
          e.changedTouches[0].clientX > (left + width * 0.2) && e.changedTouches[0].clientX < (left + width * 0.8) &&
          e.changedTouches[0].clientY > (top + height * 0.2) && e.changedTouches[0].clientY < (top + height * 0.8)
        ) {
          isClicked.current = true;
          e.preventDefault()
          e.stopPropagation()
        }
      }
      // 桌面模式下
      else {
        if (
          e.clientX > (left + width * 0.2) && e.clientX < (left + width * 0.8) &&
          e.clientY > (top + height * 0.2) && e.clientY < (top + height * 0.8)
        ) {
          isClicked.current = true;
          e.preventDefault()
          e.stopPropagation()
        }
      }
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
        console.log(e)
        target.style.top = `${e.changedTouches[0].clientY - 150}px`;
        target.style.left = `${e.changedTouches[0].clientX - 250}px`;
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