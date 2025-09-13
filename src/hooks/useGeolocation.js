
import { useState, useCallback } from 'react'
import { isGeolocationSupported } from '../utils/helpers'

/**
 * Custom hook for geolocation functionality
 */
const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentLocation = useCallback(() => {
    if (!isGeolocationSupported()) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLoading(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 5 * 60 * 1000 // 5 minutes
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords
      
      setLocation({
        latitude,
        longitude,
        accuracy,
        timestamp: Date.now()
      })
      setLoading(false)
      setError(null)
    }

    const handleError = (error) => {
      setLoading(false)
      
      let errorMessage = 'Unable to retrieve your location.'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location services and refresh the page.'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please try again.'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.'
          break
        default:
          errorMessage = `An unknown error occurred: ${error.message}`
          break
      }
      
      setError(errorMessage)
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options)
  }, [])

  // Watch position for real-time location updates
  const watchLocation = useCallback(() => {
    if (!isGeolocationSupported()) {
      setError('Geolocation is not supported by this browser.')
      return null
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: Date.now()
        })
        setError(null)
      },
      (error) => {
        let errorMessage = 'Unable to watch your location.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        
        setError(errorMessage)
      },
      options
    )

    return watchId
  }, [])

  const clearWatch = useCallback((watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const clearLocation = useCallback(() => {
    setLocation(null)
    setError(null)
  }, [])

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    watchLocation,
    clearWatch,
    clearLocation,
    isSupported: isGeolocationSupported()
  }
}

export default useGeolocation