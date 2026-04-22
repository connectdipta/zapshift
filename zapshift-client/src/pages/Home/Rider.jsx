import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import lottie from 'lottie-web'
import LottieAnimation from '../../components/LottieAnimation'
import riderAnimation from '../../assets/animations/rider.json'
import warehousesData from '../../assets/warehouses.json'
import useAuth from '../../hooks/useAuth'
import axiosSecure from '../../hooks/useAxiosSecure'
import useCurrentUserRole from '../../hooks/useCurrentUserRole'
import { useLocation, useNavigate } from 'react-router'

const Rider = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      age: '',
      district: '',
      nid: '',
      contact: '',
      warehouse: ''
    }
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { riderStatus, refetch: refetchCurrentUser } = useCurrentUserRole()

  // Extract unique districts from warehouses data
  const districts = [...new Set(warehousesData.map(w => w.district))].sort()

  // Extract unique warehouses
  const warehouses = [...new Set(warehousesData.map(w => w.city))].sort()

  const applicationStatus = useMemo(() => String(riderStatus || 'none').toLowerCase(), [riderStatus])
  const isPending = applicationStatus === 'pending' || submitted
  const isApproved = applicationStatus === 'approved'
  const isRejected = applicationStatus === 'rejected'

  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email)
    }

    if (user?.displayName) {
      setValue('name', user.displayName)
    }
  }, [setValue, user])

  useEffect(() => {
    if (applicationStatus !== 'pending') return undefined

    const intervalId = setInterval(() => {
      refetchCurrentUser?.()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [applicationStatus, refetchCurrentUser])

  const onSubmit = async (data) => {
    if (!user?.email) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please log in before submitting a rider application.',
        confirmButtonColor: '#caeb66',
      })
      navigate('/login', { state: location.pathname })
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        ...data,
        email: user.email,
        name: data.name || user.displayName || 'User',
      }

      await axiosSecure.post('/users/rider-request', payload)

      await Swal.fire({
        icon: 'success',
        title: 'Application Submitted',
        html: `
          <div class="text-center">
            <div id="rider-application-success" style="width:180px;height:180px;margin:0 auto;"></div>
            <p class="mt-3 text-gray-700 font-semibold">Your application is now in pending.</p>
            <p class="text-sm text-gray-500">We will review your application and contact you soon.</p>
          </div>
        `,
        confirmButtonColor: '#caeb66',
        width: 'min(92vw, 520px)',
        didOpen: () => {
          const container = document.getElementById('rider-application-success')
          if (container) {
            lottie.loadAnimation({
              container,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              animationData: riderAnimation,
            })
          }
        },
        willClose: () => {
          const container = document.getElementById('rider-application-success')
          if (container) container.innerHTML = ''
        },
      })

      setSubmitted(true)
      reset({
        name: user.displayName || '',
        email: user.email || '',
        age: '',
        district: '',
        nid: '',
        contact: '',
        warehouse: ''
      })

      setTimeout(() => {
        setSubmitted(false)
      }, 2500)
      await refetchCurrentUser?.()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error?.response?.data?.message || 'Could not submit rider application.',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className=" mx-auto bg-white rounded-3xl p-4 sm:p-6 lg:p-10 pt-2 shadow-2xl">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Be a Rider</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left side - Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tell us about yourself</h2>

            {isApproved ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-green-700 font-semibold text-lg">Congratulations, you are now a rider.</p>
                <p className="text-green-600 text-sm mt-2">Your application has been approved by admin.</p>
              </div>
            ) : isPending ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                <p className="text-amber-700 font-semibold text-lg">Your application is now in pending.</p>
                <p className="text-amber-600 text-sm mt-2">We are reviewing your rider request. The form is hidden until a decision is made.</p>
              </div>
            ) : isRejected ? (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
                  <p className="text-red-700 font-semibold text-lg">Your rider application was rejected.</p>
                  <p className="text-red-600 text-sm mt-2">You can submit a new application if you want to try again.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <fieldset disabled={isSubmitting} className={isSubmitting ? 'space-y-6 opacity-80 pointer-events-none' : 'space-y-6'}>
                {/* Name and Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-lg font-semibold text-gray-900 transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                  </fieldset>
                </form>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <fieldset disabled={isSubmitting} className={isSubmitting ? 'space-y-6 opacity-80 pointer-events-none' : 'space-y-6'}>
                {/* Name and Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-lg font-semibold text-gray-900 transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                </fieldset>
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