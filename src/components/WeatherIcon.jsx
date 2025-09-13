import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle,
  Cloudy,
  Wind,
  Eye
} from 'lucide-react'

/**
 * Weather icon component that maps OpenWeatherMap icon codes to Lucide icons
 */
const WeatherIcon = ({ 
  icon, 
  size = 24, 
  className = '', 
  animate = false,
  weatherId = null 
}) => {
  const getIconComponent = (iconCode, weatherId) => {
    // OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
    const iconMap = {
      // Clear sky
      '01d': Sun,
      '01n': Sun,
      
      // Few clouds
      '02d': Cloudy,
      '02n': Cloudy,
      
      // Scattered clouds
      '03d': Cloud,
      '03n': Cloud,
      
      // Broken clouds
      '04d': Cloudy,
      '04n': Cloudy,
      
      // Shower rain
      '09d': CloudRain,
      '09n': CloudRain,
      
      // Rain
      '10d': CloudRain,
      '10n': CloudRain,
      
      // Thunderstorm
      '11d': CloudLightning,
      '11n': CloudLightning,
      
      // Snow
      '13d': CloudSnow,
      '13n': CloudSnow,
      
      // Mist/Fog - use Cloud since Fog doesn't exist
      '50d': Cloud,
      '50n': Cloud
    }

    // Fallback to weather ID mapping if icon code doesn't match
    const weatherIdMap = {
      // Thunderstorm group (2xx)
      200: CloudLightning, 201: CloudLightning, 202: CloudLightning,
      210: CloudLightning, 211: CloudLightning, 212: CloudLightning,
      221: CloudLightning, 230: CloudLightning, 231: CloudLightning, 232: CloudLightning,
      
      // Drizzle group (3xx)
      300: CloudDrizzle, 301: CloudDrizzle, 302: CloudDrizzle,
      310: CloudDrizzle, 311: CloudDrizzle, 312: CloudDrizzle,
      313: CloudDrizzle, 314: CloudDrizzle, 321: CloudDrizzle,
      
      // Rain group (5xx)
      500: CloudRain, 501: CloudRain, 502: CloudRain, 503: CloudRain, 504: CloudRain,
      511: CloudSnow, 520: CloudRain, 521: CloudRain, 522: CloudRain, 531: CloudRain,
      
      // Snow group (6xx)
      600: CloudSnow, 601: CloudSnow, 602: CloudSnow,
      611: CloudSnow, 612: CloudSnow, 613: CloudSnow,
      615: CloudSnow, 616: CloudSnow, 620: CloudSnow,
      621: CloudSnow, 622: CloudSnow,
      
      // Atmosphere group (7xx) - use Wind for atmospheric conditions
      701: Wind, 711: Wind, 721: Wind, 731: Wind, 741: Cloud,
      751: Wind, 761: Wind, 762: Cloud, 771: Wind, 781: Wind,
      
      // Clear group (800)
      800: Sun,
      
      // Clouds group (80x)
      801: Cloudy, 802: Cloud, 803: Cloudy, 804: Cloudy
    }

    return iconMap[iconCode] || weatherIdMap[weatherId] || Cloud
  }

  const IconComponent = getIconComponent(icon, weatherId)
  
  const getIconColor = (iconCode) => {
    const isDay = iconCode?.endsWith('d')
    
    if (icon?.startsWith('01')) { // Clear sky
      return isDay ? 'text-yellow-500' : 'text-blue-200'
    } else if (icon?.startsWith('02') || icon?.startsWith('03')) { // Few/scattered clouds
      return 'text-gray-400 dark:text-gray-300'
    } else if (icon?.startsWith('04')) { // Broken clouds
      return 'text-gray-500 dark:text-gray-400'
    } else if (icon?.startsWith('09') || icon?.startsWith('10')) { // Rain
      return 'text-blue-500 dark:text-blue-400'
    } else if (icon?.startsWith('11')) { // Thunderstorm
      return 'text-purple-500 dark:text-purple-400'
    } else if (icon?.startsWith('13')) { // Snow
      return 'text-blue-200 dark:text-blue-100'
    } else if (icon?.startsWith('50')) { // Mist
      return 'text-gray-400 dark:text-gray-300'
    }
    
    return 'text-gray-500 dark:text-gray-400'
  }

  const animationClass = animate ? 'animate-float' : ''
  const colorClass = getIconColor(icon)
  
  return (
    <IconComponent 
      size={size}
      className={`${colorClass} ${animationClass} ${className} weather-icon-glow`}
    />
  )
}

export default WeatherIcon