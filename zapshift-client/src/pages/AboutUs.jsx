import React, { useState } from 'react'

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('story')

  const tabs = [
    { id: 'story', label: 'Story' },
    { id: 'mission', label: 'Mission' },
    { id: 'success', label: 'Success' },
    { id: 'team', label: 'Team & Others' }
  ]

  const content = {
    story: `We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.

We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.

We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.`,
    
    mission: `Our mission is to revolutionize parcel delivery through innovation and customer excellence. We aim to provide fast, reliable, and affordable delivery services to every corner of the country while maintaining the highest standards of service quality.`,
    
    success: `With thousands of successful deliveries, 99% on-time delivery rate, and a growing network of delivery partners, ZapShift has become the trusted choice for delivery services across the region.`,
    
    team: `Our dedicated team of logistics experts, technology innovators, and customer service professionals work tirelessly to ensure every delivery is handled with care and precision. We believe in the power of teamwork and continuous improvement.`
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl p-10 pt-2 shadow-2xl">
      {/* Header */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-gray-300 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-semibold text-lg transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                style={{
                  color: activeTab === tab.id ? 'var(--color-primary)' : 'inherit',
                  borderBottomColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content[activeTab]}
          </div>
        </div>
      </div>

      {/* Stats Section (Optional) */}
      <div className="bg-white py-16 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>5000+</div>
            <p className="text-gray-600">Deliveries Completed</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>99%</div>
            <p className="text-gray-600">On-Time Delivery</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>500+</div>
            <p className="text-gray-600">Active Riders</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>24/7</div>
            <p className="text-gray-600">Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
