/**
 * Format temperature with unit
 */
export const formatTemperature = (temp, unit = 'C') => {
  return `${Math.round(temp)}°${unit}`
}

/**
 * Format date to readable string
 */
export const formatDate = (timestamp, options = {}) => {
  const date = new Date(timestamp)
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  return date.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format time to readable string
 */
export const formatTime = (timestamp, options = {}) => {
  const date = new Date(timestamp)
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  return date.toLocaleTimeString('en-US', defaultOptions)
}

/**
 * Get day name from timestamp
 */
export const getDayName = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
}

/**
 * Convert wind direction in degrees to compass direction
 */
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

/**
 * Convert wind speed (m/s) to different units
 */
export const convertWindSpeed = (speedMs, unit = 'kmh') => {
  switch (unit) {
    case 'kmh':
      return Math.round(speedMs * 3.6)
    case 'mph':
      return Math.round(speedMs * 2.237)
    default:
      return Math.round(speedMs)
  }
}

/**
 * Get weather condition category for styling
 */
export const getWeatherCategory = (weatherMain, icon) => {
  const categories = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'stormy',
    'Snow': 'snowy',
    'Mist': 'cloudy',
    'Fog': 'cloudy',
    'Haze': 'cloudy',
    'Smoke': 'cloudy',
    'Dust': 'cloudy',
    'Sand': 'cloudy',
    'Ash': 'cloudy',
    'Squall': 'stormy',
    'Tornado': 'stormy'
  }
  
  return categories[weatherMain] || 'cloudy'
}

/**
 * Get color theme based on weather
 */
export const getWeatherTheme = (category) => {
  const themes = {
    sunny: {
      bg: 'from-yellow-400 via-orange-400 to-red-400',
      text: 'text-white',
      accent: 'text-yellow-100'
    },
    cloudy: {
      bg: 'from-gray-400 via-gray-500 to-gray-600',
      text: 'text-white',
      accent: 'text-gray-100'
    },
    rainy: {
      bg: 'from-blue-400 via-blue-500 to-indigo-600',
      text: 'text-white',
      accent: 'text-blue-100'
    },
    stormy: {
      bg: 'from-gray-600 via-gray-700 to-gray-900',
      text: 'text-white',
      accent: 'text-gray-200'
    },
    snowy: {
      bg: 'from-blue-200 via-white to-gray-200',
      text: 'text-gray-800',
      accent: 'text-gray-600'
    }
  }
  
  return themes[category] || themes.cloudy
}

/**
 * Calculate air quality index description
 */
export const getAQIDescription = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: 'text-green-600' }
  if (aqi <= 100) return { level: 'Moderate', color: 'text-yellow-600' }
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'text-orange-600' }
  if (aqi <= 200) return { level: 'Unhealthy', color: 'text-red-600' }
  if (aqi <= 300) return { level: 'Very Unhealthy', color: 'text-purple-600' }
  return { level: 'Hazardous', color: 'text-red-800' }
}

/**
 * Get UV index description
 */
export const getUVDescription = (uvIndex) => {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600' }
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600' }
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600' }
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600' }
  return { level: 'Extreme', color: 'text-purple-600' }
}

/**
 * Calculate feels like temperature explanation
 */
export const getFeelsLikeReason = (temp, feelsLike, humidity, windSpeed) => {
  const diff = Math.abs(temp - feelsLike)
  
  if (diff < 2) return "Similar to actual temperature"
  
  if (feelsLike > temp) {
    if (humidity > 70) return "High humidity makes it feel warmer"
    return "Heat index makes it feel warmer"
  } else {
    if (windSpeed > 5) return "Wind chill makes it feel cooler"
    return "Lower humidity makes it feel cooler"
  }
}

/**
 * Get weather advice based on conditions
 */
export const getWeatherAdvice = (weatherData) => {
  const { weather, temperature, wind, humidity } = weatherData
  const advice = []
  
  if (temperature.current < 0) {
    advice.push("🧥 Bundle up! It's freezing outside.")
  } else if (temperature.current < 10) {
    advice.push("🧥 Wear a warm jacket.")
  } else if (temperature.current > 30) {
    advice.push("☀️ Stay hydrated and wear sunscreen.")
  }
  
  if (weather.main === 'Rain' || weather.main === 'Drizzle') {
    advice.push("☔ Don't forget your umbrella!")
  }
  
  if (weather.main === 'Snow') {
    advice.push("❄️ Drive carefully, roads may be slippery.")
  }
  
  if (wind.speed > 10) {
    advice.push("💨 It's quite windy today!")
  }
  
  if (humidity > 80) {
    advice.push("💧 High humidity - stay cool and hydrated.")
  }
  
  return advice
}

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if location services are supported
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator
}

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Validate coordinates
 */
export const isValidCoordinates = (lat, lon) => {
  return (
    typeof lat === 'number' && 
    typeof lon === 'number' && 
    lat >= -90 && 
    lat <= 90 && 
    lon >= -180 && 
    lon <= 180
  )
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

/**
 * Get relative time string
 */
export const getRelativeTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 1) return 'Just now'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  
  return formatDate(timestamp, { month: 'short', day: 'numeric' })
}

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}