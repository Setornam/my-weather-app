// src/routes/Index.tsx
import type { MetaFunction } from "@remix-run/node";
import React, { useState, useEffect } from 'react';
import styles from './Index.module.css';
import { FaSearch } from 'react-icons/fa';


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [locationInput, setLocationInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const handleLocationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(event.target.value);
  };

  const handleFetchWeather = async () => {
    try {
      setError(null);
      setLoading(true);

      if (locationInput.trim() === '') {
        return;
      }

      // Get location coordinates using Geocoding API
      const coordinates = await getLocationCoordinates(locationInput);

      // Replace with your actual API key
      const apiKey = '8b0cd19f8a1467ffcac4eb459e0ec1cf';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
    }
  };

  // Function to get location coordinates using OpenWeatherMap Geocoding API
  const getLocationCoordinates = async (locationName: string) => {
    try {
      // Replace with your actual API key
      const geocodingApiKey = '8b0cd19f8a1467ffcac4eb459e0ec1cf';
      const geocodingResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&appid=${geocodingApiKey}`);
      const geocodingData = await geocodingResponse.json();

      if (geocodingData.length > 0) {
        const firstResult = geocodingData[0];
        return {
          latitude: firstResult.lat,
          longitude: firstResult.lon,
        };
      } else {
        throw new Error('No results found for the location');
      }
    } catch (error) {
      throw error;
    }
  };

  // Update current date and time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.weatherContainer}>
       {/* {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>} */}

      {weatherData && (
        <div className= {styles.weatherOutput}>
          <h2 className={styles.temperature}> {weatherData.main.temp}°</h2>
          <h2 className={styles.weatherHeader}> {weatherData.name}</h2>
          <div className={styles.dateTime}>
            <p>{currentDateTime.toLocaleString()}</p>
            <p className={styles.description}> {weatherData.weather[0].description}</p>
          </div>         
           
        </div>
      )}

        <div className={styles.locationInput}>
          
          <input
            type="text"
            id="locationInput"
            value={locationInput}
            onChange={handleLocationInputChange}
            placeholder="Enter Location"
          />
          <button onClick={handleFetchWeather}><FaSearch/></button>
        </div>
    </div>
  );
}
