import { useState, useEffect } from 'react'
import { Moon, Sun, MapPin, Heart, Trash2 } from 'lucide-react'
import SearchBar from './components/SearchBar'
import CityCard from './components/CityCard'
import LoadingSpinner from './components/LoadingSpinner'
import useLocalStorage from './hooks/useLocalStorage'
import useGeolocation from './hooks/useGeolocation'
import useWeatherAPI from './hooks/useWeatherAPI'

//const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)
  const [favoriteCities, setFavoriteCities] = useLocalStorage('favoriteCities', [])
  const [selectedCity, setSelectedCity] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)

  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation()
  const { weatherData, loading: weatherLoading, error: weatherError, fetchWeather } = useWeatherAPI()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (location && !selectedCity) {
      fetchWeather(null, location.latitude, location.longitude)
      setSelectedCity({
        name: 'Your Location',
        lat: location.latitude,
        lon: location.longitude,
        isCurrentLocation: true
      })
    }
  }, [location, selectedCity, fetchWeather])

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    fetchWeather(city.name, city.lat, city.lon)
  }

  const toggleFavorite = (city) => {
    setFavoriteCities(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.name === city.name)
      if (isAlreadyFavorite) {
        return prev.filter(fav => fav.name !== city.name)
      } else {
        return [...prev, city]
      }
    })
  }

  const removeFavorite = (cityName) => {
    setFavoriteCities(prev => prev.filter(city => city.name !== cityName))
  }

  const handleLocationRequest = () => {
    getCurrentLocation()
  }

  return (
<div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text text-shadow">
              Weather Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-base sm:text-lg">
              Real-time weather data and forecasts
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Location Button */}
            <button
              onClick={handleLocationRequest}
              disabled={locationLoading}
              className="btn-secondary flex items-center gap-1 text-sm sm:text-base px-2 sm:px-3 lg:px-4"
              title="Get current location weather"
            >
              <MapPin size={10} className="sm:size-12 lg:size-10" />
              {locationLoading ? 'Locating...' : 'My Location'}
            </button>

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`btn-secondary flex items-center gap-1 text-sm sm:text-base px-2 sm:px-3 lg:px-4 ${
                favoriteCities.length > 0 ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={favoriteCities.length === 0}
            >
              <Heart size={10} className={`sm:size-12 lg:size-10 ${showFavorites ? 'fill-current' : ''}`} />
              Favorites ({favoriteCities.length})
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-secondary p-2 sm:p-2.5 lg:p-3"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={10} className="sm:size-12 lg:size-10" /> : <Moon size={10} className="sm:size-12 lg:size-10" />}
            </button>
          </div>
        </header>

        {/* Error Messages */}
        {locationError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            <p className="font-medium text-sm sm:text-base">Location Error:</p>
            <p className="text-xs sm:text-sm">{locationError}</p>
          </div>
        )}

        {weatherError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            <p className="font-medium text-sm sm:text-base">Weather Error:</p>
            <p className="text-xs sm:text-sm">{weatherError}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onCitySelect={handleCitySelect}
            placeholder="Search for cities..."
          />
        </div>

        {/* Favorites Section */}
        {showFavorites && favoriteCities.length > 0 && (
          <div className="mb-6">
            <div className="weather-card animate-slide-up">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                Favorite Cities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteCities.map((city) => (
                  <div key={city.name} className="relative group">
                    <div 
                      className="glass-effect rounded-lg p-3 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-200"
                      onClick={() => handleCitySelect(city)}
                    >
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200">
                        {city.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {city.country}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFavorite(city.name)
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Remove from favorites"
                    >
                      <Trash2 size={12} className="sm:size-8" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="space-y-6">
          {weatherLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner size="large" />
            </div>
          ) : weatherData ? (
            <CityCard
              weatherData={weatherData}
              city={selectedCity}
              onToggleFavorite={() => toggleFavorite(selectedCity)}
              isFavorite={favoriteCities.some(fav => fav.name === selectedCity?.name)}
            />
          ) : (
            <div className="text-center py-10">
              <div className="weather-card max-w-md mx-auto">
                <div className="text-4xl sm:text-6xl mb-3">🌤️</div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                  Welcome to Weather Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                  Search for a city or use your current location to get started
                </p>
                <button
                  onClick={handleLocationRequest}
                  disabled={locationLoading}
                  className="btn-primary text-sm sm:text-base px-3 sm:px-4"
                >
                  {locationLoading ? 'Getting Location...' : 'Use My Location'}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-xs sm:text-sm">
            Made with ❤️ using React, Vite & OpenWeatherMap API
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
