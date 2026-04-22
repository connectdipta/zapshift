import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import lottie from 'lottie-web';
import riderAnimation from '../../assets/animations/rider.json';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLocation, useNavigate } from 'react-router';
import { MdOutlineLocalShipping, MdPerson, MdLocationOn, MdInfoOutline, MdOutlineArrowForward, MdOutlineSecurity, MdArrowDropDown } from "react-icons/md";

const SendParcel = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
    defaultValues: {
      parcelType: 'document',
      senderRegion: '',
      senderDistrict: '',
      receiverRegion: '',
      receiverDistrict: '',
    }
  });
  
  const [warehouses, setWarehouses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const parcelType = watch('parcelType');
  const senderRegion = watch('senderRegion');
  const receiverRegion = watch('receiverRegion');
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetch('/warehouses.json')
      .then(res => res.json())
      .then(data => setWarehouses(data))
      .catch(error => console.error('Error fetching warehouses:', error));
  }, []);

  const regions = [...new Set(warehouses.map(w => w.region))].sort();
  const getDistrictsByRegion = (region) => {
    if (!region) return [];
    return [...new Set(warehouses.filter(w => w.region === region).map(w => w.district))].sort();
  };

  useEffect(() => { setValue('senderDistrict', ''); }, [senderRegion, setValue]);
  useEffect(() => { setValue('receiverDistrict', ''); }, [receiverRegion, setValue]);

  const calculateAmount = (data) => {
    const weight = Math.max(1, parseFloat(data.parcelWeight) || 1);
    const rate = data.parcelType === 'document' ? 60 : 80;
    return Math.round(weight * rate);
  };

  const onSubmit = async (data) => {
    const amount = calculateAmount(data);
    const result = await Swal.fire({
      title: 'Confirm Booking',
      html: `
        <div class="max-w-full mx-auto text-center px-2">
          <div id="swal-parcel-animation" style="width:140px;height:140px;margin:0 auto;"></div>
          <div class="mt-4 space-y-4 text-left">
            <div class="rounded-2xl bg-lime-50 p-4 border border-lime-100 text-center">
               <p class="text-[10px] font-black uppercase tracking-widest text-lime-600">Total Estimation</p>
               <p class="text-3xl font-black text-[#103d45]">Tk ${amount}</p>
            </div>
            <div class="space-y-2">
               <div class="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <span class="w-16">Sender:</span>
                  <span class="text-[#103d45] truncate font-black">${data.senderDistrict}</span>
               </div>
               <div class="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <span class="w-16">Receiver:</span>
                  <span class="text-[#103d45] truncate font-black">${data.receiverDistrict}</span>
               </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm & Book',
      confirmButtonColor: '#103d45',
      cancelButtonColor: '#f1f5f9',
      customClass: {
        popup: 'rounded-[2.5rem] shadow-2xl p-6 sm:p-10',
        confirmButton: 'rounded-xl px-8 py-3 font-bold',
        cancelButton: 'rounded-xl px-8 py-3 font-bold text-gray-400'
      },
      didOpen: () => {
        const container = document.getElementById('swal-parcel-animation');
        if (container) {
          lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: true, animationData: riderAnimation });
        }
      }
    });

    if (result.isConfirmed) {
      try {
        if (!user?.email) {
          await Swal.fire({ icon: 'error', title: 'Session Required', text: 'Please sign in to place bookings.', confirmButtonColor: '#103d45' });
          navigate('/login', { state: location.pathname });
          return;
        }
        setIsSubmitting(true);
        const payload = { ...data, amount, senderEmail: user.email };
        const response = await axiosSecure.post('/parcels', payload);
        if (response?.data?.insertedId) {
          await Swal.fire({ title: 'Success!', text: 'Your parcel is now in our system.', icon: 'success', confirmButtonColor: '#caeb66' });
          reset();
        }
      } catch (error) {
        await Swal.fire({ icon: 'error', title: 'Booking Error', text: error?.response?.data?.message || 'Failed to submit.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const inputClasses = "w-full rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 text-sm font-bold text-[#103d45] outline-none transition-all placeholder:text-gray-300 focus:border-[#caeb66] focus:ring-4 focus:ring-lime-50/50 hover:border-gray-200 shadow-sm";
  const selectClasses = "w-full appearance-none rounded-xl border-2 border-gray-100 bg-white px-5 py-4 text-sm font-bold text-[#103d45] outline-none transition-all focus:border-[#caeb66] focus:ring-4 focus:ring-lime-50/50 hover:border-gray-200 shadow-sm cursor-pointer";

  return (
    <div className="min-h-screen bg-[#fcfdf2] py-12 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[3.5rem] bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] sm:p-12 lg:p-20 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#caeb66]/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="relative mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-lime-100/50 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#103d45] mb-6 border border-lime-200"
          >
             <MdOutlineLocalShipping className="text-xl" /> Instant Delivery Booking
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-[#103d45] sm:text-7xl leading-[0.9]">Send A <span className="text-[#caeb66]">Parcel.</span></h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-gray-500/80 leading-relaxed">Provide accurate shipment details for seamless door-to-door delivery across our national network.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-12">
          <fieldset disabled={isSubmitting} className="space-y-12">
            {/* Step 1: Parcel Identity */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#103d45] text-[#caeb66] text-sm font-black shadow-lg shadow-[#103d45]/20">01</div>
                 <h2 className="text-2xl font-black text-[#103d45]">Parcel Identity</h2>
              </div>
              
              <div className="flex flex-wrap gap-4">
                 {['document', 'non-document'].map(type => (
                   <label key={type} className={`group flex cursor-pointer items-center gap-4 rounded-[1.5rem] border-2 px-8 py-5 transition-all duration-300 ${parcelType === type ? 'border-[#caeb66] bg-lime-50/50 shadow-xl shadow-lime-100/50 ring-4 ring-lime-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                      <input type="radio" value={type} {...register('parcelType')} className="hidden" />
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${parcelType === type ? 'border-[#caeb66] bg-[#caeb66]' : 'border-gray-200'}`}>
                         <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <span className={`text-sm font-black uppercase tracking-widest ${parcelType === type ? 'text-[#103d45]' : 'text-gray-400 group-hover:text-gray-600'}`}>{type}</span>
                   </label>
                 ))}
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Parcel Nickname</label>
                   <input type="text" placeholder="e.g. Birthday Gift" {...register('parcelName', { required: true })} className={inputClasses} />
                </div>
                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Total Weight (KG)</label>
                   <input type="number" step="0.1" placeholder="0.5" {...register('parcelWeight', { required: true })} className={inputClasses} />
                </div>
              </div>
            </section>

            {/* Route Mapping */}
            <div className="grid gap-12 lg:grid-cols-2">
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#103d45] text-[#caeb66] text-sm font-black shadow-lg shadow-[#103d45]/20">02</div>
                    <h2 className="text-2xl font-black text-[#103d45]">Sender Info</h2>
                 </div>
                 
                 <div className="space-y-6 rounded-[3rem] bg-gray-50/50 p-8 sm:p-10 border border-gray-100 shadow-inner">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                       <input type="text" {...register('senderName', { required: true })} className={inputClasses} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-3 relative">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Region</label>
                          <div className="relative">
                            <select {...register('senderRegion', { required: true })} className={selectClasses}>
                                <option value="">Select</option>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <MdArrowDropDown className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                          </div>
                       </div>
                       <div className="space-y-3 relative">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">District</label>
                          <div className="relative">
                            <select {...register('senderDistrict', { required: true })} disabled={!senderRegion} className={selectClasses}>
                                <option value="">Select</option>
                                {getDistrictsByRegion(senderRegion).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <MdArrowDropDown className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                       <input type="tel" {...register('senderPhone', { required: true })} className={inputClasses} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Street Address</label>
                       <textarea rows="3" {...register('senderAddress', { required: true })} className={`${inputClasses} resize-none`} />
                    </div>
                 </div>
              </section>

              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#103d45] text-[#caeb66] text-sm font-black shadow-lg shadow-[#103d45]/20">03</div>
                    <h2 className="text-2xl font-black text-[#103d45]">Receiver Info</h2>
                 </div>
                 
                 <div className="space-y-6 rounded-[3rem] bg-gray-50/50 p-8 sm:p-10 border border-gray-100 shadow-inner">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Receiver Name</label>
                       <input type="text" {...register('receiverName', { required: true })} className={inputClasses} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-3 relative">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Region</label>
                          <div className="relative">
                            <select {...register('receiverRegion', { required: true })} className={selectClasses}>
                                <option value="">Select</option>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <MdArrowDropDown className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                          </div>
                       </div>
                       <div className="space-y-3 relative">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">District</label>
                          <div className="relative">
                            <select {...register('receiverDistrict', { required: true })} disabled={!receiverRegion} className={selectClasses}>
                                <option value="">Select</option>
                                {getDistrictsByRegion(receiverRegion).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <MdArrowDropDown className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Contact Number</label>
                       <input type="tel" {...register('receiverPhone', { required: true })} className={inputClasses} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Drop-off Address</label>
                       <textarea rows="3" {...register('receiverAddress', { required: true })} className={`${inputClasses} resize-none`} />
                    </div>
                 </div>
              </section>
            </div>

            {/* Final Action Area */}
            <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-lime-50 flex items-center justify-center text-[#103d45]">
                     <MdOutlineSecurity className="text-2xl" />
                  </div>
                  <div className="max-w-xs">
                     <p className="text-sm font-black text-[#103d45]">Secure Handling</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Real-time GPS tracking enabled across our national grid.</p>
                  </div>
               </div>
               
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 type="submit"
                 disabled={isSubmitting}
                 className="w-full sm:w-auto rounded-[2rem] bg-[#caeb66] px-16 py-6 text-sm font-black text-[#103d45] shadow-2xl shadow-lime-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
               >
                 {isSubmitting ? 'Finalizing...' : 'Confirm Shipment Booking'}
                 <MdOutlineArrowForward className="text-2xl" />
               </motion.button>
            </div>
          </fieldset>
        </form>
      </div>
      </div>
    </div>
  );
};

export default SendParcel;
