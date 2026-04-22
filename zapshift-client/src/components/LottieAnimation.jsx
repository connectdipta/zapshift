import React, { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

const LottieAnimation = ({ 
  animationData, 
  loop = true, 
  autoplay = true,
  speed = 1,
  height = 400,
  width = 400,
  className = ''
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && animationData) {
      lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
        speed,
      })

      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }
      }
    }
  }, [animationData, loop, autoplay, speed])

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        width: className ? '100%' : `${width}px`, 
        height: className ? '100%' : `${height}px`,
        minWidth: 0,
        minHeight: 0,
        margin: '0 auto'
      }}
    />
  )
}

export default LottieAnimation
