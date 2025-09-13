import { useState, useEffect, useRef } from 'react'
import { Search, X, MapPin, Loader2 } from 'lucide-react'
import { useCitySearch } from '../hooks/useWeatherAPI'
import { debounce } from '../utils/helpers'

const SearchBar = ({ onCitySelect, placeholder = "Search for cities..." }) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef(null)
  const resultsRef = useRef(null)
  
  const { cities, loading, error, searchCityByName, clearSearch } = useCitySearch()

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((searchQuery) => {
      searchCityByName(searchQuery)
    }, 300)
  ).current

  useEffect(() => {
    if (query.trim().length >= 2) {
      debouncedSearch(query.trim())
      setIsOpen(true)
    } else {
      clearSearch()
      setIsOpen(false)
    }
    setSelectedIndex(-1)
  }, [query, debouncedSearch, clearSearch])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length === 0) {
      setIsOpen(false)
    }
  }

  const handleCitySelect = (city) => {
    setQuery(city.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    onCitySelect(city)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
    clearSearch()
    searchRef.current?.querySelector('input')?.focus()
  }

  const handleKeyDown = (e) => {
    if (!isOpen || cities.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < cities.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : cities.length - 1
        )
        break
        
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < cities.length) {
          handleCitySelect(cities[selectedIndex])
        }
        break
        
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
        
      default:
        break
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex]
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }
  }, [selectedIndex])

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field pl-12 pr-12"
          autoComplete="off"
          spellCheck="false"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            type="button"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 glass-effect rounded-xl border border-white/20 dark:border-gray-700/20 shadow-xl max-h-60 overflow-y-auto">
          {loading && cities.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Searching cities...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 dark:text-red-400">
              <p className="text-sm">Error: {error}</p>
            </div>
          ) : cities.length > 0 ? (
            <ul ref={resultsRef} className="py-2">
              {cities.map((city, index) => (
                <li key={`${city.name}-${city.country}-${index}`}>
                  <button
                    onClick={() => handleCitySelect(city)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors flex items-center gap-3 ${
                      index === selectedIndex ? 'bg-white/20 dark:bg-gray-700/20' : ''
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {city.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {city.state ? `${city.state}, ${city.country}` : city.country}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No cities found for "{query}"</p>
              <p className="text-xs mt-1">Try checking the spelling or use a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar