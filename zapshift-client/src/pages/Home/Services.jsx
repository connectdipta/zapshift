import React from 'react'
import OurServices from '../../components/OurServices'

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--color-primary)] font-semibold">Our Services</p>
          <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Explore what ZapShift can do for you</h1>
          <p className="mt-4 text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            Choose the delivery option that fits your business or personal needs, from express parcels to nationwide logistics and fulfillment support.
          </p>
        </div>

        <OurServices />
      </div>
    </div>
  )
}

export default Services
