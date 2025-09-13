# Weather Dashboard

A modern, responsive weather dashboard built with React and Vite. Get real-time weather data, 3-day forecasts, and location-based weather information.

## 🌟 Features

- **Real-time Weather Data**: Current temperature, conditions, and weather icons
- **3-Day Forecast**: High/low temperatures with weather icons
- **City Search**: Dynamic search with input validation and error handling
- **Geolocation Support**: Auto-detect user location for instant weather data
- **Loading States**: Smooth loading indicators and error feedback
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Favorite Cities**: Save cities for quick access

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Beautiful icons
- **OpenWeatherMap API** - Weather data provider

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free at https://openweathermap.org/api)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
weather-dashboard/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── CityCard.jsx
│   │   ├── ForecastCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── SearchBar.jsx
│   │   └── WeatherIcon.jsx
│   ├── hooks/
│   │   ├── useGeolocation.js
│   │   ├── useLocalStorage.js
│   │   └── useWeatherAPI.js
│   ├── services/
│   │   └── weatherAPI.js
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## 🔧 Configuration Files

### Environment Variables (.env)
```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

### Tailwind Config (tailwind.config.js)
- Custom theme configurations
- Dark mode support
- Responsive breakpoints

### Vite Config (vite.config.js)
- React plugin configuration
- Build optimizations

## 📱 Components

### CityCard
- Displays current weather for a city
- Shows temperature, condition, and weather icon
- Handles favorite toggling

### ForecastCard
- Shows 3-day weather forecast
- Temperature highs/lows
- Weather icons for each day

### SearchBar
- City search functionality
- Input validation
- Error handling for invalid cities

### WeatherIcon
- Dynamic weather icons based on conditions
- Uses Lucide React icons

### LoadingSpinner
- Consistent loading states
- Animated spinner component

## 🔨 Custom Hooks

### useWeatherAPI
- Fetches weather data from OpenWeatherMap API
- Handles loading states and errors
- Caches API responses

### useGeolocation
- Gets user's current location
- Handles permission requests
- Error handling for location services

### useLocalStorage
- Persists favorite cities
- Theme preference storage
- Synchronizes with localStorage

## 🌐 API Integration

The app integrates with OpenWeatherMap API:
- **Current Weather**: `/weather` endpoint
- **5-Day Forecast**: `/forecast` endpoint
- **Geocoding**: `/geo/1.0/direct` for city search

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Responsive design** with mobile-first approach
- **Dark/Light mode** support
- **Custom animations** and transitions

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Vercel
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy automatically on git push

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run: `npm run deploy`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling system
- [Vite](https://vitejs.dev/) for blazing fast build tool

---

Made with ❤️ and ⚡ Vite
