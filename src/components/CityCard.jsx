import { useState } from 'react'
import { 
  Heart, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  RefreshCw,
  Clock
} from 'lucide-react'
import WeatherIcon from './WeatherIcon'
import ForecastCard from './ForecastCard'
import { 
  formatTemperature, 
  formatTime, 
  getWindDirection, 
  convertWindSpeed,
  capitalizeWords,
  getWeatherAdvice,
  getRelativeTime
} from '../utils/helpers'

const CityCard = ({ weatherData, city, onToggleFavorite, isFavorite }) => {
  const [showDetails, setShowDetails] = useState(false)

  if (!weatherData) {
    return null
  }

  const {
    name,
    country,
    weather,
    temperature,
    humidity,
    pressure,
    visibility,
    wind,
    clouds,
    sunrise,
    sunset,
    lastUpdated,
    forecast
  } = weatherData

  const advice = getWeatherAdvice(weatherData)
  const windDirection = getWindDirection(wind.direction)
  const windSpeedKmh = convertWindSpeed(wind.speed, 'kmh')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Weather Card */}
      <div className="weather-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Section - City Info & Main Weather */}
          <div className="flex-1">
            {/* City Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
                    {name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {country} {city?.isCurrentLocation && '• Current Location'}
                  </p>
                </div>
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40'
                    : 'bg-gray-100 dark:bg-gray-800/20 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/40'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'fill-current' : ''} 
                />
              </button>
            </div>

            {/* Main Weather Display */}
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <WeatherIcon 
                  icon={weather.icon}
                  weatherId={weather.id}
                  size={80}
                  animate={true}
                  className="mb-2"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {capitalizeWords(weather.description)}
                </p>
              </div>
              
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200">
                    {temperature.current}
                  </span>
                  <span className="text-2xl text-gray-600 dark:text-gray-400">°C</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Feels like {formatTemperature(temperature.feelsLike)}
                </p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-blue-600 dark:text-blue-400">
                    ↓ {formatTemperature(temperature.min)}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ↑ {formatTemperature(temperature.max)}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Advice */}
            {advice.length > 0 && (
              <div className="glass-effect rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Weather Advice
                </h4>
                <ul className="space-y-1">
                  {advice.slice(0, 2).map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Section - Quick Stats */}
          <div className="lg:w-80">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-effect rounded-lg p-4 text-center">
                <Droplets className="h-6 w-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {humidity}%
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <Wind className="h-6 w-6 text-green-500 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Wind</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {windSpeedKmh}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  km/h {windDirection}
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <Gauge className="h-6 w-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Pressure</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {pressure}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">hPa</p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <Eye className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Visibility</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {visibility || 'N/A'}
                </p>
                {visibility && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">km</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Toggle */}
        <div className="mt-6 pt-6 border-t border-gray-200/20 dark:border-gray-700/20">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <span className="font-medium">
              {showDetails ? 'Hide Details' : 'Show More Details'}
            </span>
            <RefreshCw 
              className={`h-4 w-4 transition-transform duration-200 ${
                showDetails ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-6 space-y-6 animate-slide-up">
            {/* Sun Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Sunrise className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    Sunrise
                  </h4>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {formatTime(sunrise)}
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Sunset className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    Sunset
                  </h4>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {formatTime(sunset)}
                </p>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-effect rounded-lg p-4 text-center">
                <Thermometer className="h-6 w-6 text-red-500 dark:text-red-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Feels Like</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {formatTemperature(temperature.feelsLike)}
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <div className="h-6 w-6 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">☁️</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clouds</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {clouds}%
                </p>
              </div>
              
              {wind.gust && (
                <div className="glass-effect rounded-lg p-4 text-center">
                  <Wind className="h-6 w-6 text-green-600 dark:text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wind Gusts</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {Math.round(wind.gust * 3.6)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">km/h</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-6 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Last updated: {getRelativeTime(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Forecast Card */}
      {forecast && <ForecastCard forecastData={forecast} />}
    </div>
  )
}

export default CityCard