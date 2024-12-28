import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import WeatherCard from './components/WeatherCard';
import WeatherForecast from './components/WeatherForecast';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric'); // metric for Celsius, imperial for Fahrenheit
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  const apiKey = '2941afe2e0d174fdd5f3edb8549805fa'; // Use your OpenWeatherMap API key here

  // Effect to fetch weather data when city or unit changes
  useEffect(() => {
    if (!city) return;

    setLoading(true);
    setError('');
    const fetchWeather = async () => {
      try {
        const currentWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
        );
        setWeatherData(currentWeatherResponse.data);

        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
        );

        const forecastData = forecastResponse.data.list;
        const dailyForecast = [];
        let currentDate = '';

        forecastData.forEach((item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (date !== currentDate) {
            currentDate = date;
            dailyForecast.push({
              date: date,
              temp: {
                max: Math.round(item.main.temp_max),
                min: Math.round(item.main.temp_min),
              },
              condition: item.weather[0].description,
              icon: item.weather[0].icon,
            });
          }
        });
        setForecast(dailyForecast.slice(0, 5));
      } catch (err) {
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, unit]);

  const handleSearch = () => {
    if (!city) setError('Please enter a city');
  };

  const handleUnitToggle = (e) => {
    setUnit(e.target.value);
  };

  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
          );
          const cityName = response.data.name;
          setCity(cityName);
        } catch (error) {
          setError('Unable to get location data');
        }
      });
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const handleAddToFavorites = () => {
    if (city && !favorites.includes(city)) {
      setFavorites((prevFavorites) => [...prevFavorites, city]);
    }
  };

  const handleFavoriteClick = (favoriteCity) => {
    setCity(favoriteCity); // Change the city to the clicked favorite
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Weather Dashboard</h1>

      {/* Search bar */}
      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={handleSearch}>Search</Button>
        </Col>
      </Row>

      {/* Unit toggle */}
      <Row className="mb-4">
        <Col>
          <Form.Check
            type="radio"
            label="Celsius"
            name="unit"
            value="metric"
            checked={unit === 'metric'}
            onChange={handleUnitToggle}
            className="me-3"
          />
          <Form.Check
            type="radio"
            label="Fahrenheit"
            name="unit"
            value="imperial"
            checked={unit === 'imperial'}
            onChange={handleUnitToggle}
          />
        </Col>
      </Row>

      {/* Geolocation */}
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={handleGeolocation}>
            Use Current Location
          </Button>
        </Col>
      </Row>

      {/* Add to favorites */}
      <Row className="mb-4">
        <Col>
          <Button variant="success" onClick={handleAddToFavorites}>Add to Favorites</Button>
        </Col>
      </Row>

      {/* Error handling */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Weather data and forecast */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {weatherData && (
            <WeatherCard
              city={weatherData.name}
              temperature={Math.round(weatherData.main.temp)}
              condition={weatherData.weather[0].description}
              icon={weatherData.weather[0].icon}
              humidity={weatherData.main.humidity}
              windSpeed={weatherData.wind.speed}
            />
          )}

          {forecast.length > 0 && <WeatherForecast forecast={forecast} />}
        </>
      )}

      {/* Favorites list */}
      <Row className="mt-4">
        <Col>
          <h3>Favorites</h3>
          <ul>
            {favorites.map((fav, index) => (
              <li key={index}>
                <Button variant="link" onClick={() => handleFavoriteClick(fav)}>{fav}</Button>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default WeatherDashboard;
