import React, { Component } from 'react';
import './App.css';

//use the freecodecamp api to render weather
class App extends Component {
  constructor(props) {
    super(props);
    //set the states as undefined at first
    //fill these with info from the api
    this.state = {
      //what we'll set from getLocation() call
      longitude: undefined,
      latitude: undefined,
      tempScale: undefined,
      //the raw stamps to check against sunrise/sunset
      timestamp: undefined,
      sunriseStamp: undefined,
      sunsetStamp: undefined,
      //the final Date objects
      temp: undefined,
      fahrenheitTemp: undefined,
      time: undefined,
      sunrise: undefined,
      sunset: undefined,
      //show error message if this is true
      error: undefined
    };

    //bind the methods so we can use them
    this.getLocation = this.getLocation.bind(this);
    this.getTemp = this.getTemp.bind(this);
    this.changeTempScale = this.changeTempScale.bind(this);
  }

  //uses the navigator api to find location
  //if the user says no, set this.state.error = true
  getLocation() {
    navigator.geolocation.getCurrentPosition (
      (position) => {
        this.setState({
          latitude: position.coords.latitude.toFixed(2),
          longitude: position.coords.longitude.toFixed(2),
          error: null
        });
      },
      (error) => this.setState({ error: true }),
      //makes the function call high accuracy for 20 seconds at max
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    )
  }

  //change from fahrenheit to celcius to kelvin
  changeTempScale() {
    this.state.tempScale === 'fahrenheit' ? this.setState({ tempScale: 'celcius' }) : this.setState({ tempScale: 'fahrenheit' });
  }

  //gets the temp off the coords provided
  getTemp() {
    //Get requesting the api
    const request = new XMLHttpRequest();
    request.open('GET', `https://fcc-weather-api.glitch.me/api/current?lat=${this.state.latitude}&lon=${this.state.longitude}`, true);

      request.onload = () => {
        //On a successful call
        if (request.status >= 200 && request.status < 400) {
          //parses data from json to javascript
          const data = JSON.parse(request.responseText);

          //set variables which will take in the call data
          let temp =  (data.main.temp).toFixed(2);
          let time = new Date(data.dt * 1000).toLocaleString();
          let sunrise = new Date(data.sys.sunrise * 1000).toLocaleString();
          let sunset = new Date(data.sys.sunset * 1000).toLocaleString();
          
          //set state call 
          this.setState({
            temp: temp,
            fahrenheitTemp: temp * 1.8 + 32,
            time: time,
            sunrise: sunrise,
            sunset: sunset,
            //turns timestamps into proper unix time
            timestamp: data.dt * 1000,
            sunriseStamp: data.sys.sunrise * 1000,
            sunsetStamp: data.sys.sunset * 1000
          });
            
        } else {
          //error call
          this.setState({ error: true })
        }
      };

      request.onerror = () => {
        // There was a connection error of some sort
        this.setState({ error: true })
      }
      request.send();
  }

  

  render() {
    return (
      <div className="App">
        <h3>Weather App with the FCC API</h3>
        <p>Press the button to get your weather</p>
        <button onClick={this.getLocation}>Press Me to get your longitude and latitude</button>
        <button onClick={this.getTemp}>Press Me to get your weather!</button>
        <button onClick={this.changeTempScale}>Change Temp Scale</button>
        <div>Your temp scale is currently: {this.state.tempScale}</div>
        <div id="output">
          {this.state.error && `Sorry, we couldn't get your location or weather`}
          {this.state.latitude && `Your Latitude is: ${this.state.latitude}`} 
          <br />
          {this.state.longitude && `Your Longitude is: ${this.state.longitude}`} 
          <br />
          {this.state.tempScale === 'fahrenheit' ? `The temperature outside is: ${this.state.fahrenheitTemp} degrees` : `The temperature outside is:  ${this.state.temp} degrees`}
          <br />
          {this.state.timestamp && `The sunrise ${(this.state.timestamp > this.state.sunriseStamp ? 'will be' : 'was')} at: ${this.state.sunrise}`}
          <br />
          {this.state.timestamp && `The sunset ${(this.state.timestamp < this.state.sunsetStamp ? 'will be' : 'was')} at: ${this.state.sunset}`}
        </div>
      </div>
    );
  }
}

export default App;

