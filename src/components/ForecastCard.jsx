import WeatherIcon from './WeatherIcon'
import { formatTemperature, getDayName, capitalizeWords } from '../utils/helpers'

const ForecastCard = ({ forecastData }) => {
  if (!forecastData || !forecastData.forecasts || forecastData.forecasts.length === 0) {
    return null
  }

  return (
    <div className="weather-card">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        3-Day Forecast
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {forecastData.forecasts.map((forecast, index) => (
          <div
            key={`${forecast.date}-${index}`}
            className="glass-effect rounded-xl p-4 text-center hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-200"
          >
            {/* Day */}
            <div className="mb-3">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {getDayName(forecast.timestamp)}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(forecast.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Weather Icon */}
            <div className="mb-4 flex justify-center">
              <WeatherIcon 
                icon={forecast.weather.icon}
                weatherId={forecast.weather.id}
                size={48}
                animate={true}
              />
            </div>

            {/* Weather Description */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {capitalizeWords(forecast.weather.description)}
              </p>
            </div>

            {/* Temperature */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">High</p>
                  <p className="text-lg font-bold text-red-500 dark:text-red-400">
                    {formatTemperature(forecast.temperature.max)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Low</p>
                  <p className="text-lg font-bold text-blue-500 dark:text-blue-400">
                    {formatTemperature(forecast.temperature.min)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Humidity:</span>
                <span className="font-medium">{forecast.humidity}%</span>
              </div>
              
              {forecast.pop > 0 && (
                <div className="flex justify-between">
                  <span>Rain Chance:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {forecast.pop}%
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Wind:</span>
                <span className="font-medium">
                  {Math.round(forecast.wind.speed * 3.6)} km/h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Forecast data updates every 3 hours • Powered by OpenWeatherMap
        </p>
      </div>
    </div>
  )
}

export default ForecastCard