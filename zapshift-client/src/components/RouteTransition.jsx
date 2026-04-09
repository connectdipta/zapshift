import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router'
import AOS from 'aos'

const RouteTransition = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    AOS.refresh()
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div data-aos="fade-up">{children}</div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RouteTransition
