import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router'
import { pageTransition, springTransition } from './motionPresets'

const RouteTransition = ({ children }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={springTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default RouteTransition
