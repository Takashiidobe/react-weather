import React, { Component } from 'react';
import './App.css';

// rehash the freecodecamp app in react
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: undefined,
      longitude: undefined,
      latitude: undefined,
      time: undefined,
      sunrise: undefined,
      sunset: undefined,
      error: null,
    };

    this.getLocation = this.getLocation.bind(this);
    this.getTemp = this.getTemp.bind(this);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition (
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )
  }

  getTemp() {
    const request = new XMLHttpRequest();
    request.open('GET', `https://fcc-weather-api.glitch.me/api/current?lat=${this.state.latitude}&lon=${this.state.longitude}`, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          const data = JSON.parse(request.responseText);
          console.log(data);
          this.setState({ 
            temp: data.main.temp,
            time: data.dt,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset
          });
        } else {
          // We reached our target server, but it returned an error

        }
      };

      request.onerror = () => {
        // There was a connection error of some sort
      }
      request.send();
  }

  render() {
    return (
      <div className="App">
        <h3>FreeCodeCamp Weather App</h3>
        <p>Press the button to get your weather</p>
        <button onClick={this.getLocation}>Press Me</button>
        <button onClick={this.getTemp}>Press Me too!</button>
        <div id="output">
          {this.state.latitude} 
          <br />
          {this.state.longitude} 
          <br />
          {this.state.temp} 
          <br />
          {this.state.time}
          <br />
          {this.state.sunrise}
          <br />
          {this.state.sunset}
        </div>
      </div>
    );
  }
}

export default App;

