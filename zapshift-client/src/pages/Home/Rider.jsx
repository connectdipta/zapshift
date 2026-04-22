import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import lottie from 'lottie-web'
import { motion, AnimatePresence } from 'framer-motion'
import LottieAnimation from '../../components/LottieAnimation'
import riderAnimation from '../../assets/animations/rider.json'
import warehousesData from '../../assets/warehouses.json'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import useCurrentUserRole from '../../hooks/useCurrentUserRole'
import { useLocation, useNavigate } from 'react-router'
import { MdOutlineDirectionsBike, MdBadge, MdContactPhone, MdLocationCity, MdOutlineExplore, MdCheckCircleOutline, MdPendingActions, MdErrorOutline, MdArrowDropDown, MdOutlineArrowForward } from 'react-icons/md'

const Rider = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const axiosSecure = useAxiosSecure()
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

  const districts = [...new Set(warehousesData.map(w => w.district))].sort()
  const warehouses = [...new Set(warehousesData.map(w => w.city))].sort()

  const applicationStatus = useMemo(() => String(riderStatus || 'none').toLowerCase(), [riderStatus])
  const isPending = applicationStatus === 'pending' || submitted
  const isApproved = applicationStatus === 'approved'
  const isRejected = applicationStatus === 'rejected'

  useEffect(() => {
    if (user?.email) setValue('email', user.email)
    if (user?.displayName) setValue('name', user.displayName)
  }, [setValue, user])

  useEffect(() => {
    if (applicationStatus !== 'pending') return undefined
    const intervalId = setInterval(() => { refetchCurrentUser?.() }, 5000)
    return () => clearInterval(intervalId)
  }, [applicationStatus, refetchCurrentUser])

  const onSubmit = async (data) => {
    if (!user?.email) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please log in before submitting a rider application.',
        confirmButtonColor: '#103d45',
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
        title: 'Application Received',
        html: `
          <div class="text-center">
            <div id="rider-application-success" style="width:160px;height:160px;margin:0 auto;"></div>
            <p class="mt-4 text-[#103d45] font-black">Your application is now under review.</p>
            <p class="text-xs text-gray-500 mt-2">We will notify you once our team verifies your documents.</p>
          </div>
        `,
        confirmButtonColor: '#caeb66',
        confirmButtonText: 'Great!',
        customClass: {
          popup: 'rounded-[3rem] p-10',
          confirmButton: 'rounded-2xl px-12 py-4 text-[#103d45] font-black'
        },
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
        }
      })

      setSubmitted(true)
      reset()
      await refetchCurrentUser?.()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error?.response?.data?.message || 'Could not submit application.',
        confirmButtonColor: '#103d45',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses = "w-full rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 text-sm font-bold text-[#103d45] outline-none transition-all placeholder:text-gray-300 focus:border-[#caeb66] focus:ring-4 focus:ring-lime-50/50 hover:border-gray-200 shadow-sm";
  const selectClasses = "w-full appearance-none rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 text-sm font-bold text-[#103d45] outline-none transition-all focus:border-[#caeb66] focus:ring-4 focus:ring-lime-50/50 hover:border-gray-200 shadow-sm cursor-pointer";

  return (
    <div className="min-h-screen bg-[#fcfdf2] py-12 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[3.5rem] bg-white p-8 sm:p-12 lg:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#caeb66]/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
             {/* Left Column: Content & Status */}
             <div className="relative z-10">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#103d45] px-6 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#caeb66] mb-8"
                >
                   <MdOutlineDirectionsBike className="text-xl" /> Join the Fleet
                </motion.div>
                
                <h1 className="text-5xl lg:text-7xl font-black text-[#103d45] mb-8 leading-[0.9] tracking-tight">
                   Drive your <br/> <span className="text-[#caeb66]">success.</span>
                </h1>
                
                <p className="text-lg font-medium text-gray-500 mb-12 leading-relaxed">
                   ZapShift riders are the backbone of our national logistics network. Join a community that values your time and rewards your hard work.
                </p>

                {/* Status Cards */}
                <AnimatePresence mode="wait">
                  {isApproved && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2.5rem] bg-lime-50 border-2 border-[#caeb66] flex items-center gap-6">
                       <div className="h-16 w-16 rounded-2xl bg-[#caeb66] flex items-center justify-center text-[#103d45]">
                          <MdCheckCircleOutline className="text-4xl" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-[#103d45]">Welcome Aboard!</h4>
                          <p className="text-sm font-bold text-gray-500 mt-1">Your rider account is active. Check your dashboard to start deliveries.</p>
                       </div>
                    </motion.div>
                  )}

                  {isPending && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2.5rem] bg-gray-50 border-2 border-gray-100 flex items-center gap-6 shadow-inner">
                       <div className="h-16 w-16 rounded-2xl bg-[#103d45] flex items-center justify-center text-[#caeb66]">
                          <MdPendingActions className="text-4xl animate-pulse" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-[#103d45]">Verification in Progress</h4>
                          <p className="text-sm font-bold text-gray-500 mt-1">We are currently auditing your documents. This usually takes 24-48 hours.</p>
                       </div>
                    </motion.div>
                  )}

                  {isRejected && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2.5rem] bg-red-50 border-2 border-red-100 flex items-center gap-6">
                       <div className="h-16 w-16 rounded-2xl bg-red-500 flex items-center justify-center text-white">
                          <MdErrorOutline className="text-4xl" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-red-700">Application Rejected</h4>
                          <p className="text-sm font-bold text-red-500 mt-1">One or more documents could not be verified. You may re-submit the form below.</p>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Illustration for Default State */}
                {!isApproved && !isPending && !isRejected && (
                   <div className="hidden lg:block pt-8 transition-all duration-700">
                      <LottieAnimation animationData={riderAnimation} height={350} width={350} />
                   </div>
                )}
             </div>

             {/* Right Column: Application Form */}
             <div className="relative z-10">
                {(isRejected || (!isApproved && !isPending)) && (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-gray-50/50 p-8 sm:p-12 rounded-[3.5rem] border border-gray-100 shadow-inner"
                   >
                      <div className="mb-10">
                         <h3 className="text-2xl font-black text-[#103d45] mb-2">Registration Form</h3>
                         <p className="text-xs font-black uppercase tracking-widest text-gray-400">Step into the future of delivery</p>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Full Name</label>
                               <input type="text" {...register('name', { required: true })} className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Age</label>
                               <input type="number" {...register('age', { required: true, min: 18 })} className={inputClasses} />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Email Address</label>
                            <input type="email" {...register('email', { required: true })} className={inputClasses} />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">District</label>
                               <div className="relative">
                                  <select {...register('district', { required: true })} className={selectClasses}>
                                     <option value="">Select</option>
                                     {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                  <MdArrowDropDown className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">NID Number</label>
                               <input type="text" {...register('nid', { required: true })} className={inputClasses} />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Preferred Warehouse</label>
                            <div className="relative">
                               <select {...register('warehouse', { required: true })} className={selectClasses}>
                                  <option value="">Select Warehouse</option>
                                  {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                               </select>
                               <MdArrowDropDown className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Primary Contact</label>
                            <input type="tel" {...register('contact', { required: true })} className={inputClasses} />
                         </div>

                         <motion.button
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full bg-[#caeb66] text-[#103d45] py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-lime-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                         >
                           {isSubmitting ? 'Processing Application...' : 'Submit Application'}
                           <MdOutlineArrowForward className="text-2xl" />
                         </motion.button>
                      </form>
                   </motion.div>
                )}

                {(isApproved || isPending) && (
                   <div className="flex flex-col items-center justify-center h-full text-center p-12">
                      <LottieAnimation animationData={riderAnimation} height={400} width={400} />
                      <p className="text-gray-400 font-bold max-w-xs mt-8">Your application is currently being processed by our regional managers.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rider