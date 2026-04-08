import React from 'react'
import OurServices from '../components/OurServices'

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary)] font-semibold">Our Services</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">Explore what ZapShift can do for you</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Choose the delivery option that fits your business or personal needs, from express parcels to nationwide logistics and fulfillment support.
          </p>
        </div>

        <OurServices />
      </div>
    </div>
  )
}

export default Services
