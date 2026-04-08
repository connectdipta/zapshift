import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Footer from '../components/Footer'
import LottieAnimation from '../components/LottieAnimation'
import riderAnimation from '../assets/animations/rider.json'
import warehousesData from '../assets/warehouses.json'

const Rider = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      age: '',
      email: '',
      district: '',
      nid: '',
      contact: '',
      warehouse: ''
    }
  })

  const [submitted, setSubmitted] = useState(false)

  // Extract unique districts from warehouses data
  const districts = [...new Set(warehousesData.map(w => w.district))].sort()

  // Extract unique warehouses
  const warehouses = [...new Set(warehousesData.map(w => w.city))].sort()

  const onSubmit = (data) => {
    console.log('Form submitted:', data)
    setSubmitted(true)
    reset()
    
    setTimeout(() => {
      setSubmitted(false)
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl p-10 pt-2 shadow-2xl">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Be a Rider</h1>
          <p className="text-gray-600 max-w-2xl">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Form Section */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left side - Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tell us about yourself</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-green-700 font-semibold">✓ Application submitted successfully!</p>
                <p className="text-green-600 text-sm mt-2">We will review your application and contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name and Age */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      {...register('name', { required: 'Name is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your age</label>
                    <input
                      type="number"
                      placeholder="Your age"
                      {...register('age', { required: 'Age is required', min: { value: 18, message: 'Must be 18+' } })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        errors.age ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.age && <span className="text-red-500 text-xs mt-1">{errors.age.message}</span>}
                  </div>
                </div>

                {/* Email and District */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      placeholder="Your Email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your District</label>
                    <select
                      {...register('district', { required: 'District is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your District</option>
                      {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {errors.district && <span className="text-red-500 text-xs mt-1">{errors.district.message}</span>}
                  </div>
                </div>

                {/* NID and Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">NID No</label>
                    <input
                      type="text"
                      placeholder="NID"
                      {...register('nid', { required: 'NID is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        errors.nid ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.nid && <span className="text-red-500 text-xs mt-1">{errors.nid.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
                    <input
                      type="tel"
                      placeholder="Contact"
                      {...register('contact', { required: 'Contact is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        errors.contact ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact && <span className="text-red-500 text-xs mt-1">{errors.contact.message}</span>}
                  </div>
                </div>

                {/* Warehouse */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Which wire-house you want to work?</label>
                  <select
                    {...register('warehouse', { required: 'Wire-house is required' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white ${
                      errors.warehouse ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select wire-house</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse} value={warehouse}>{warehouse}</option>
                    ))}
                  </select>
                  {errors.warehouse && <span className="text-red-500 text-xs mt-1">{errors.warehouse.message}</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg font-semibold text-gray-900 transition hover:brightness-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          {/* Right side - Image */}
          <div className="flex items-center justify-center">
            <LottieAnimation 
              animationData={riderAnimation}
              loop={true}
              autoplay={true}
              height={400}
              width={400}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rider