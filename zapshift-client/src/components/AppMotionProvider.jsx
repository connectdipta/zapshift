import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const AppMotionProvider = ({ children }) => {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 30,
      easing: 'ease-out-cubic',
    })

    const handleLoad = () => AOS.refreshHard()
    window.addEventListener('load', handleLoad)

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return children
}

export default AppMotionProvider
