import React, { useState } from 'react'
import { ChevronDown, Rocket, Globe, Zap, BookOpen, Target, Star, Gem, Lock, DollarSign, Phone, Handshake, Users, Sprout, Lightbulb, Trophy } from 'lucide-react'

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('story')
  const [activeFAQ, setActiveFAQ] = useState(null)

  const tabs = [
    { id: 'story', label: 'Story', icon: BookOpen },
    { id: 'mission', label: 'Mission', icon: Target },
    { id: 'vision', label: 'Vision', icon: Star },
    { id: 'values', label: 'Core Values', icon: Gem }
  ]

  const content = {
    story: `ZapShift was born from a simple frustration — watching businesses and individuals struggle with unreliable delivery services. We realized that parcels don't just need to arrive; they need to arrive on time, safely, and with complete transparency.

Since our inception, we've revolutionized the delivery landscape across Bangladesh. Our commitment to innovation, real-time tracking, and customer-centric service has made us the preferred choice for thousands of businesses and individual customers.

Today, ZapShift operates across all 64 districts of Bangladesh with a network of 500+ dedicated riders, 50+ service centers, and cutting-edge logistics technology. We're not just moving parcels — we're building trust, one delivery at a time.`,
    
    mission: `To revolutionize parcel delivery through innovation, reliability, and customer excellence. We are committed to:

• Providing fast, transparent, and affordable delivery services to every corner of Bangladesh
• Empowering riders with fair compensation and growth opportunities
• Leveraging technology to create a seamless delivery experience
• Maintaining the highest standards of service quality and safety
• Building lasting relationships with our customers and partners`,
    
    vision: `To become Asia's most trusted and innovative last-mile delivery platform, transforming how parcels, packages, and goods move across borders and communities. We envision a future where:

• Every parcel reaches its destination on time, every time
• Communities are connected through reliable, affordable delivery
• Riders have sustainable income and career growth
• Technology enables transparency and trust at every step
• Sustainability and social responsibility guide our operations`,

    values: `Trust & Transparency: We operate with complete honesty in every interaction

Speed & Reliability: Delivering excellence on every journey

People First: Our riders, customers, and team are our greatest asset

Sustainability: Responsible operations that care for our environment

Innovation: Continuous improvement through technology

Excellence: We never settle for less than the best`
  }

  const keyFeatures = [
    {
      icon: Rocket,
      title: 'Real-Time Tracking',
      description: 'Track your parcel every step of the journey with live GPS updates and status notifications'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Same-day and next-day delivery options available in major cities across Bangladesh'
    },
    {
      icon: Lock,
      title: 'Secure Handling',
      description: 'OTP verification and digital proof of delivery ensure your parcel is in safe hands'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden charges. Clear, upfront pricing based on weight, distance, and parcel type'
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Round-the-clock customer support via chat, phone, and email for any concerns'
    },
    {
      icon: Globe,
      title: 'National Coverage',
      description: 'Serving all 64 districts with reliable delivery networks and local expertise'
    }
  ]

  const pricingPlans = [
    {
      type: 'Document',
      weight: 'Any Weight',
      withinCity: '৳60',
      outsideCity: '৳80'
    },
    {
      type: 'Non-Document',
      weight: 'Up to 3kg',
      withinCity: '৳110',
      outsideCity: '৳150'
    },
    {
      type: 'Non-Document',
      weight: '>3kg',
      withinCity: '৳150+',
      outsideCity: '৳190+'
    }
  ]

  const faqItems = [
    {
      id: 1,
      question: 'How long does delivery typically take?',
      answer: 'Within the same city: 24-48 hours. Outside city/district: 3-5 business days depending on distance and logistics. We provide estimated delivery dates at booking.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards for online payments. You can also pay cash on delivery in select areas. Payment is processed securely through our encrypted gateway.'
    },
    {
      id: 3,
      question: 'What if my parcel is damaged or lost?',
      answer: 'We offer comprehensive parcel insurance. If any damage or loss occurs, report it within 48 hours with photo evidence. We handle claims within 7 business days.'
    },
    {
      id: 4,
      question: 'Can I track my parcel in real-time?',
      answer: 'Yes! Every parcel gets a unique tracking number. You can track its journey through our app or website with live GPS updates and status changes.'
    },
    {
      id: 5,
      question: 'Do you deliver to all areas of Bangladesh?',
      answer: 'Yes, we operate across all 64 districts. However, delivery times may vary based on location remoteness. Some areas may have extended delivery times.'
    },
    {
      id: 6,
      question: 'How do I become a delivery rider?',
      answer: 'Visit our "Become a Rider" page and submit your application. After verification, you\'ll receive training and can start earning immediately. We offer ৳20 per successful delivery.'
    }
  ]

  const workflow = [
    {
      step: 1,
      title: 'Book Your Parcel',
      description: 'Enter parcel details, weight, pickup and delivery locations through our app or website'
    },
    {
      step: 2,
      title: 'Make Payment',
      description: 'Pay the calculated charge securely. Get your unique tracking number instantly'
    },
    {
      step: 3,
      title: 'Pickup Confirmation',
      description: 'Our rider arrives at your location, verifies the parcel, and marks it as picked up'
    },
    {
      step: 4,
      title: 'In Transit',
      description: 'Parcel moves through our network. Track real-time status and location updates'
    },
    {
      step: 5,
      title: 'Out for Delivery',
      description: 'Parcel reaches the destination service center and is assigned to delivery rider'
    },
    {
      step: 6,
      title: 'Delivered',
      description: 'Rider delivers with OTP verification. Proof of delivery is shared immediately'
    }
  ]

  return (
    <div className="mx-auto bg-white rounded-3xl p-10 pt-2 shadow-2xl mt-6 mb-6">
      {/* Hero Section */}
      <div className="relative rounded mt-3 overflow-hidden pt-12 pb-20 px-6 md:px-12" style={{ backgroundColor: 'var(--color-secondary)' }}>
        <div className="max-w-5xl mx-auto ">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About ZapShift</h1>
            <p className="text-xl md:text-2xl font-light mb-8" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Transforming parcel delivery across Bangladesh with speed, reliability, and innovation
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <span className="px-6 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
                <Users size={16} /> 500+ Active Riders
              </span>
              <span className="px-6 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
                <Globe size={16} /> 64 Districts Covered
              </span>
              <span className="px-6 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
                <Zap size={16} /> 5000+ Deliveries
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Story Section with Tabs */}
        <div className="py-16">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600">Learn about our mission, vision, and the values that drive us</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 mb-10 border-b-2 pb-6" style={{ borderColor: 'var(--color-primary)' }}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? 'var(--color-secondary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'inherit'
                  }}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
              {content[activeTab]}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: 'var(--color-secondary)' }}>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="font-semibold">Deliveries Completed</p>
              <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>And counting</p>
            </div>
            <div className="text-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}>
              <div className="text-4xl font-bold mb-2">99%</div>
              <p className="font-semibold">On-Time Delivery</p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-secondary)', opacity: 0.7 }}>Reliability guaranteed</p>
            </div>
            <div className="text-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: 'var(--color-secondary)' }}>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="font-semibold">Active Riders</p>
              <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Professional partners</p>
            </div>
            <div className="text-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}>
              <div className="text-4xl font-bold mb-2">64</div>
              <p className="font-semibold">Districts Served</p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-secondary)', opacity: 0.7 }}>Nationwide coverage</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose ZapShift?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100" style={{ borderColor: 'var(--color-primary)' }}>
                  <IconComponent size={48} style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }} />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Delivery Workflow */}
        <div className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">How ZapShift Works</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {workflow.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg border-4 z-10 relative" style={{ borderColor: 'var(--color-secondary)' }}>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>{item.step}</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2 text-center">{item.title}</h3>
                    <p className="text-sm text-gray-600 text-center">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Transparent Pricing</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">No hidden charges. Clear, straightforward pricing based on your parcel type, weight, and delivery distance.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div key={idx} className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow" style={{ backgroundColor: idx === 1 ? 'var(--color-primary)' : '#f8f9fa', color: idx === 1 ? 'var(--color-secondary)' : 'inherit' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)' }}>{plan.type}</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm mb-1" style={{ color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)', opacity: 0.7 }}>Weight</p>
                    <p className="font-semibold" style={{ color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)' }}>{plan.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)', opacity: 0.7 }}>Within City</p>
                    <p className="text-2xl font-bold" style={{ color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)' }}>{plan.withinCity}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)', opacity: 0.7 }}>Outside City</p>
                    <p className="text-2xl font-bold" style={{ color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-secondary)' }}>{plan.outsideCity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-left">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 transition-transform`}
                    style={{ color: 'var(--color-secondary)', transform: activeFAQ === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                {activeFAQ === item.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="rounded-3xl p-12 text-center text-white" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience ZapShift?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Join thousands of satisfied customers who trust ZapShift for fast, reliable, and transparent parcel delivery across Bangladesh.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}
              >
                Send a Parcel Now
              </button>
              <button
                className="px-8 py-3 border-2 text-white font-bold rounded-lg transition-colors hover:text-white"
                style={{ borderColor: 'var(--color-primary)', color: 'white' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(202, 235, 102, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Become a Rider
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
