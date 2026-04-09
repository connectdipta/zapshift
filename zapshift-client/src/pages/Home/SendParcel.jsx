import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import lottie from 'lottie-web';
import riderAnimation from '../../assets/animations/rider.json';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLocation, useNavigate } from 'react-router';

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
  const axiosSecure = useAxiosSecure;

  useEffect(() => {
    fetch('/warehouses.json')
      .then(res => res.json())
      .then(data => setWarehouses(data))
      .catch(error => console.error('Error fetching warehouses:', error));
  }, []);

  // Get unique regions
  const regions = [...new Set(warehouses.map(w => w.region))].sort();

  // Get districts by region
  const getDistrictsByRegion = (region) => {
    if (!region) return [];
    const uniqueDistricts = [...new Set(
      warehouses
        .filter(w => w.region === region)
        .map(w => w.district)
    )].sort();
    return uniqueDistricts;
  };

  // Reset district when region changes
  useEffect(() => {
    setValue('senderDistrict', '');
  }, [senderRegion, setValue]);

  useEffect(() => {
    setValue('receiverDistrict', '');
  }, [receiverRegion, setValue]);

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
        <div class="max-w-full mx-auto text-center px-3 sm:px-6">
          <div id="swal-parcel-animation" style="width:min(180px,70vw);height:min(180px,70vw);margin:0 auto;"></div>
          <div class="mt-4 space-y-3 text-left sm:text-left">
            <p class="text-gray-700 text-sm sm:text-base">Your booking amount is <strong>${amount} Tk</strong></p>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 text-sm text-gray-600">
              <div class="rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
                <p class="font-medium text-gray-800">Sender</p>
                <p>${data.senderRegion} / ${data.senderDistrict}</p>
              </div>
              <div class="rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
                <p class="font-medium text-gray-800">Receiver</p>
                <p>${data.receiverRegion} / ${data.receiverDistrict}</p>
              </div>
            </div>
            <p class="text-gray-500 text-sm mt-2">Do you agree to place the booking?</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Agree & Book',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      background: '#f8fafc',
      customClass: {
        popup: 'rounded-3xl shadow-2xl mx-2 sm:mx-auto',
        title: 'text-xl font-bold',
        content: 'text-sm text-gray-700',
      },
      width: 'min(95vw, 460px)',
      didOpen: () => {
        const container = document.getElementById('swal-parcel-animation');
        if (container) {
          lottie.loadAnimation({
            container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: riderAnimation,
          });
        }
      },
      willClose: () => {
        const container = document.getElementById('swal-parcel-animation');
        if (container) {
          container.innerHTML = '';
        }
      },
    });

    if (result.isConfirmed) {
      try {
        if (!user?.email) {
          await Swal.fire({
            icon: 'error',
            title: 'Login Required',
            text: 'Please login to place a booking.',
            confirmButtonColor: '#ef4444',
          });
          navigate('/login', { state: location.pathname });
          return;
        }

        setIsSubmitting(true);
        Swal.fire({
          title: 'Submitting Booking...',
          text: 'Please wait while we save your parcel.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const payload = {
          ...data,
          amount,
          senderEmail: user.email,
        };

        const response = await axiosSecure.post('/parcels', payload);
        Swal.close();

        if (response?.data?.insertedId) {
          await Swal.fire({
            title: 'Booking Placed!',
            html: `<div class="max-w-full mx-auto px-3 sm:px-6 text-center"><p class="text-sm sm:text-base text-gray-700">Your parcel booking has been confirmed for <strong>${amount} Tk</strong>.</p></div>`,
            icon: 'success',
            confirmButtonColor: '#16a34a',
            customClass: {
              popup: 'rounded-3xl shadow-2xl mx-2 sm:mx-auto',
            },
            width: 'min(95vw, 420px)',
          });
          reset({
            parcelType: 'document',
            parcelName: '',
            parcelWeight: '',
            senderName: '',
            senderRegion: '',
            senderDistrict: '',
            senderAddress: '',
            senderPhone: '',
            pickupInstruction: '',
            receiverName: '',
            receiverRegion: '',
            receiverDistrict: '',
            receiverAddress: '',
            receiverPhone: '',
            deliveryInstruction: '',
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Booking Failed',
            text: 'Could not save parcel booking. Please try again.',
            confirmButtonColor: '#ef4444',
          });
        }
      } catch (error) {
        Swal.close();
        await Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: error?.response?.data?.message || 'Failed to submit booking.',
          confirmButtonColor: '#ef4444',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className=" mx-auto bg-white rounded-3xl p-10 pt-2 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Send A Parcel</h1>
        <p className="text-gray-700 text-sm font-medium mb-6">Enter your parcel details</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isSubmitting} className={isSubmitting ? 'space-y-6 opacity-80 pointer-events-none' : 'space-y-6'}>
          {/* Parcel Type Toggle */}
          <div>
            <div className="flex items-center gap-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="document"
                  {...register('parcelType')}
                  className="w-5 h-5 text-green-500 accent-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-800">Document</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="non-document"
                  {...register('parcelType')}
                  className="w-5 h-5 text-green-500 accent-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-600">Non-Document</span>
              </label>
            </div>
          </div>

          {/* Parcel Details - Two Columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Parcel Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Parcel Name</label>
              <input
                type="text"
                placeholder="Parcel Name"
                {...register('parcelName', { required: 'Parcel name is required' })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
              />
              {errors.parcelName && (
                <p className="text-red-500 text-xs mt-1">{errors.parcelName.message}</p>
              )}
            </div>

            {/* Parcel Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Parcel Weight (KG)</label>
              <input
                type="text"
                placeholder="Parcel Weight (KG)"
                {...register('parcelWeight', { required: 'Weight is required' })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
              />
              {errors.parcelWeight && (
                <p className="text-red-500 text-xs mt-1">{errors.parcelWeight.message}</p>
              )}
            </div>
          </div>

          {/* Sender Details Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Sender Details */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Sender Details</h3>
              
              {/* Sender Name */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Sender Name</label>
                <input
                  type="text"
                  placeholder="Sender Name"
                  {...register('senderName', { required: 'Sender name is required' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                />
                {errors.senderName && (
                  <p className="text-red-500 text-xs mt-1">{errors.senderName.message}</p>
                )}
              </div>

              {/* Sender Region and District */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                {/* Sender Region */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Region</label>
                  <select
                    {...register('senderRegion', { required: 'Region is required' })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.senderRegion && (
                    <p className="text-red-500 text-xs mt-1">{errors.senderRegion.message}</p>
                  )}
                </div>

                {/* Sender District */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your District</label>
                  <select
                    {...register('senderDistrict', { required: 'District is required' })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] disabled:bg-gray-100"
                    disabled={!senderRegion}
                  >
                    <option value="">Select District</option>
                    {getDistrictsByRegion(senderRegion).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.senderDistrict && (
                    <p className="text-red-500 text-xs mt-1">{errors.senderDistrict.message}</p>
                  )}
                </div>
              </div>

              {/* Sender Address */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  placeholder="Address"
                  rows="1"
                  {...register('senderAddress', { required: 'Address is required' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] resize-none"
                />
                {errors.senderAddress && (
                  <p className="text-red-500 text-xs mt-1">{errors.senderAddress.message}</p>
                )}
              </div>

              {/* Sender Phone */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Sender Phone No</label>
                <input
                  type="tel"
                  placeholder="Sender Phone No"
                  {...register('senderPhone', { required: 'Phone is required' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                />
                {errors.senderPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.senderPhone.message}</p>
                )}
              </div>

              {/* Pickup Instruction */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Pickup Instruction</label>
                <textarea
                  placeholder="Pickup Instruction"
                  rows="3"
                  {...register('pickupInstruction')}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] resize-none"
                />
              </div>
            </div>

            {/* Right Column - Receiver Details */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Receiver Details</h3>
              
              {/* Receiver Name */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Receiver Name</label>
                <input
                  type="text"
                  placeholder="Sender Name"
                  {...register('receiverName', { required: 'Receiver name is required' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                />
                {errors.receiverName && (
                  <p className="text-red-500 text-xs mt-1">{errors.receiverName.message}</p>
                )}
              </div>

              {/* Receiver Region and District */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                {/* Receiver Region */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Receiver Region</label>
                  <select
                    {...register('receiverRegion', { required: 'Region is required' })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.receiverRegion && (
                    <p className="text-red-500 text-xs mt-1">{errors.receiverRegion.message}</p>
                  )}
                </div>

                {/* Receiver District */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Receiver District</label>
                  <select
                    {...register('receiverDistrict', { required: 'District is required' })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] disabled:bg-gray-100"
                    disabled={!receiverRegion}
                  >
                    <option value="">Select District</option>
                    {getDistrictsByRegion(receiverRegion).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.receiverDistrict && (
                    <p className="text-red-500 text-xs mt-1">{errors.receiverDistrict.message}</p>
                  )}
                </div>
              </div>

              {/* Receiver Address */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Receiver Address</label>
                <textarea
                  placeholder="Address"
                  rows="1"
                  {...register('receiverAddress', { required: 'Address is required' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] resize-none"
                />
                {errors.receiverAddress && (
                  <p className="text-red-500 text-xs mt-1">{errors.receiverAddress.message}</p>
                )}
              </div>

              {/* Receiver Phone */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Receiver Contact No</label>
                <input
                  type="tel"
                  placeholder="Sender Contact No"
                  {...register('receiverPhone', { required: 'Phone is required' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                />
                {errors.receiverPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.receiverPhone.message}</p>
                )}
              </div>

              {/* Delivery Instruction */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Instruction</label>
                <textarea
                  placeholder="Delivery Instruction"
                  rows="3"
                  {...register('deliveryInstruction')}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 pt-4">
            <p className="text-xs text-gray-600 font-bold">
              * Pickup Time 8am-7pm Approx.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D0EF5B] hover:bg-[#c4db5c] disabled:bg-gray-400 text-black font-semibold py-3 rounded-xl transition duration-200 text-sm"
          >
            {isSubmitting ? 'Processing...' : 'Proceed to Confirm Booking'}
          </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default SendParcel;
