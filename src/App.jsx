import { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;
  const BASE = 'https://api.openweathermap.org/data/2.5';

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      const params = { q: city, units: 'metric', appid: API_KEY };
      const [cur, fc] = await Promise.all([
        axios.get(`${BASE}/weather`, { params }),
        axios.get(`${BASE}/forecast`, { params }),
      ]);
      setWeather(cur.data);
      setForecast(fc.data.list.filter((i) => i.dt_txt.includes('12:00:00')));
    } catch (err) {
      alert('City not found!');
      setWeather(null);
      setForecast([]);
    }
    setLoading(false);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h2 className="text-center mb-4">Weather Forecast</h2>

      <div className="input-group mb-4">
        <input
          className="form-control"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getWeather()}
        />
        <button className="btn btn-primary" onClick={getWeather}>Search</button>
      </div>

      {loading && <div className="text-center"><div className="spinner-border" /></div>}

      {weather && (
        <div className="card text-center p-4 mb-4 shadow">
          <h3>{weather.name}, {weather.sys.country}</h3>
          <img
            className="mx-auto"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt=""
          />
          <h1>{Math.round(weather.main.temp)}°C</h1>
          <p className="text-capitalize">{weather.weather[0].description}</p>
          <div className="row">
            <div className="col">💧 Humidity: {weather.main.humidity}%</div>
            <div className="col">💨 Wind: {weather.wind.speed} m/s</div>
          </div>
        </div>
      )}

      {forecast.length > 0 && <h5>5-Day Forecast</h5>}
      <div className="row">
        {forecast.map((d) => (
          <div className="col-6 col-md mb-3" key={d.dt}>
            <div className="card text-center p-2 shadow-sm">
              <small>
                {new Date(d.dt * 1000).toLocaleDateString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short',
                })}
              </small>
              <img
                className="mx-auto"
                src={`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`}
                alt=""
              />
              <strong>{Math.round(d.main.temp)}°C</strong>
              <small className="text-capitalize">{d.weather[0].description}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;