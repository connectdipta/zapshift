import { useEffect } from 'react'

const AppMotionProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('motion-ready')

    return () => {
      root.classList.remove('motion-ready')
    }
  }, [])

  return children
}

export default AppMotionProvider
