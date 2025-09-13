import { useState, useCallback } from 'react'
import { 
  fetchCurrentWeather, 
  fetchWeatherForecast, 
  searchCities,
  getCachedData,
  setCachedData 
} from '../services/weatherAPI'

/**
 * Custom hook for weather API operations
 */
const useWeatherAPI = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (cityName = null, lat = null, lon = null) => {
    // Check cache first
    const cachedWeather = getCachedData('weather', cityName, lat, lon)
    const cachedForecast = getCachedData('forecast', cityName, lat, lon)
    
    if (cachedWeather && cachedForecast) {
      setWeatherData({ ...cachedWeather, forecast: cachedForecast })
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch current weather and forecast in parallel
      const [currentWeather, forecast] = await Promise.all([
        fetchCurrentWeather(cityName, lat, lon),
        fetchWeatherForecast(cityName, lat, lon)
      ])

      // Cache the results
      setCachedData('weather', currentWeather, cityName, lat, lon)
      setCachedData('forecast', forecast, cityName, lat, lon)

      // Combine weather and forecast data
      const combinedData = {
        ...currentWeather,
        forecast: forecast
      }

      setWeatherData(combinedData)
      setForecastData(forecast)
      setError(null)
    } catch (err) {
      console.error('Error fetching weather data:', err)
      setError(err.message)
      setWeatherData(null)
      setForecastData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshWeather = useCallback(async () => {
    if (weatherData) {
      const { coordinates } = weatherData
      await fetchWeather(null, coordinates.lat, coordinates.lon)
    }
  }, [weatherData, fetchWeather])

  const clearWeatherData = useCallback(() => {
    setWeatherData(null)
    setForecastData(null)
    setError(null)
  }, [])

  return {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather,
    refreshWeather,
    clearWeatherData
  }
}

/**
 * Custom hook for city search functionality
 */
export const useCitySearch = () => {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchCityByName = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setCities([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await searchCities(query)
      setCities(results)
      setError(null)
    } catch (err) {
      console.error('Error searching cities:', err)
      setError(err.message)
      setCities([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setCities([])
    setError(null)
  }, [])

  return {
    cities,
    loading,
    error,
    searchCityByName,
    clearSearch
  }
}

export default useWeatherAPI