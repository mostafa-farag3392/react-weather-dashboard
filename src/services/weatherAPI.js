const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

/**
 * Fetch current weather data for a city or coordinates
 */
export const fetchCurrentWeather = async (cityName = null, lat = null, lon = null) => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.')
  }

  let url = `${BASE_URL}/weather?appid=${API_KEY}&units=metric`
  
  if (cityName) {
    url += `&q=${encodeURIComponent(cityName)}`
  } else if (lat !== null && lon !== null) {
    url += `&lat=${lat}&lon=${lon}`
  } else {
    throw new Error('Either city name or coordinates must be provided')
  }

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.')
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API configuration.')
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.')
      } else {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`)
      }
    }

    const data = await response.json()
    return transformCurrentWeatherData(data)
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.')
    }
    throw error
  }
}

/**
 * Fetch 5-day weather forecast
 */
export const fetchWeatherForecast = async (cityName = null, lat = null, lon = null) => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured.')
  }

  let url = `${BASE_URL}/forecast?appid=${API_KEY}&units=metric`
  
  if (cityName) {
    url += `&q=${encodeURIComponent(cityName)}`
  } else if (lat !== null && lon !== null) {
    url += `&lat=${lat}&lon=${lon}`
  } else {
    throw new Error('Either city name or coordinates must be provided')
  }

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found for forecast data.')
      }
      throw new Error(`Failed to fetch forecast data: ${response.statusText}`)
    }

    const data = await response.json()
    return transformForecastData(data)
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error while fetching forecast.')
    }
    throw error
  }
}

/**
 * Search for cities by name
 */
export const searchCities = async (query) => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured.')
  }

  if (!query || query.trim().length < 2) {
    return []
  }

  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query.trim())}&limit=5&appid=${API_KEY}`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to search cities')
    }

    const data = await response.json()
    return data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      displayName: city.state 
        ? `${city.name}, ${city.state}, ${city.country}`
        : `${city.name}, ${city.country}`
    }))
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}

/**
 * Get city name from coordinates (reverse geocoding)
 */
export const getCityFromCoordinates = async (lat, lon) => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured.')
  }

  const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to get location name')
    }

    const data = await response.json()
    if (data.length > 0) {
      const location = data[0]
      return {
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting city from coordinates:', error)
    return null
  }
}

/**
 * Transform current weather API response to our app format
 */
const transformCurrentWeatherData = (data) => {
  return {
    id: data.id,
    name: data.name,
    country: data.sys.country,
    coordinates: {
      lat: data.coord.lat,
      lon: data.coord.lon
    },
    weather: {
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      id: data.weather[0].id
    },
    temperature: {
      current: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      min: Math.round(data.main.temp_min),
      max: Math.round(data.main.temp_max)
    },
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility ? Math.round(data.visibility / 1000) : null, // Convert to km
    wind: {
      speed: data.wind.speed,
      direction: data.wind.deg,
      gust: data.wind.gust || null
    },
    clouds: data.clouds.all,
    sunrise: data.sys.sunrise * 1000, // Convert to milliseconds
    sunset: data.sys.sunset * 1000,
    timezone: data.timezone,
    lastUpdated: Date.now()
  }
}

/**
 * Transform forecast API response to our app format
 */
const transformForecastData = (data) => {
  const dailyForecasts = []
  const processedDates = new Set()

  // Group forecast data by date and take the midday forecast for each day
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dateString = date.toISOString().split('T')[0]
    const hour = date.getHours()

    // Skip if we already have this date or if it's not around midday (12 PM)
    if (processedDates.has(dateString) || hour !== 12) {
      return
    }

    processedDates.add(dateString)
    
    dailyForecasts.push({
      date: dateString,
      timestamp: item.dt * 1000,
      weather: {
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        id: item.weather[0].id
      },
      temperature: {
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
        current: Math.round(item.main.temp)
      },
      humidity: item.main.humidity,
      wind: {
        speed: item.wind.speed,
        direction: item.wind.deg
      },
      clouds: item.clouds.all,
      pop: Math.round(item.pop * 100) // Probability of precipitation as percentage
    })
  })

  return {
    city: {
      name: data.city.name,
      country: data.city.country,
      coordinates: {
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      timezone: data.city.timezone,
      sunrise: data.city.sunrise * 1000,
      sunset: data.city.sunset * 1000
    },
    forecasts: dailyForecasts.slice(0, 3) // Return only 3-day forecast
  }
}

/**
 * Cache management for API responses
 */
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
const cache = new Map()

const getCacheKey = (type, cityName, lat, lon) => {
  if (cityName) return `${type}-${cityName}`
  return `${type}-${lat}-${lon}`
}

export const getCachedData = (type, cityName = null, lat = null, lon = null) => {
  const key = getCacheKey(type, cityName, lat, lon)
  const cached = cache.get(key)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  return null
}

export const setCachedData = (type, data, cityName = null, lat = null, lon = null) => {
  const key = getCacheKey(type, cityName, lat, lon)
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}