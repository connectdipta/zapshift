import React from 'react'
import { Link, useRouteError } from 'react-router'
import LottieAnimation from '../components/LottieAnimation'
import errorAnimation from '../assets/animations/error.json'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full bg-white border border-gray-200 rounded-3xl shadow-sm p-10 text-center">
        <div className="mb-8">
          <div className="mx-auto mb-6">
            <LottieAnimation 
              animationData={errorAnimation}
              loop={true}
              autoplay={true}
              height={300}
              width={300}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Sorry, we couldn&apos;t find the page you were looking for. It may have been moved or removed.
          </p>
        </div>

        {error?.statusText || error?.message ? (
          <div className="mb-6 text-sm text-gray-500">
            {error.status && <span className="font-medium">{error.status}:</span>} {error.statusText || error.message}
          </div>
        ) : null}

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
