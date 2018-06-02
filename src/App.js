import React, { Component } from 'react';
import './App.css';

// rehash the freecodecamp app in react

const output = document.getElementById('output');

const getLocation = () => {
  if (!navigator.geolocation) {
    output.innerHTML = `<p>Geolocation isn't supported</p>`;
    return;
  };
const success = (pos) => {
  const long = pos.coords.longitude;
  const lat = pos.coords.latitude;
  const timestamp = pos.timestamp;
  const date = new Date(timestamp);
  console.log(long, lat, timestamp, date);
};
const error = () =>{
  return;
}
navigator.geolocation.getCurrentPosition(success, error);
}


const API = `https://fcc-weather-api.glitch.me/api/current?`
const LON_PARAM = `lon=`;
const LON = `40.8136`;
const LAT_PARAM = `&lat=`;
const LAT = `-96.7026`;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: 0
    }
  }

  ComponentDidMount() {
    
    fetch(API + LON_PARAM + LON + LAT_PARAM + LAT)
    .then(response => response.json())
    .then(data => console.log(data));
  }
  render() {
    return (
      <div className="App">
        <h3>FreeCodeCamp Weather App</h3>
        <p>Press the button to get your weather</p>
        <button>Press Me</button>
        <div onClick={getLocation} id="output"></div>
      </div>
    );
  }
}






export default App;

