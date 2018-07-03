import React, { Component } from "react";
import "./App.css";
import axios from "axios";

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
      tempScale: "fahrenheit",
      weather: [],
      // After the openweathermap call
      city: '',
      country: '',
      humidity: '',


      //show error message if this is true
      error: undefined
    };

    //bind the methods so we can use them
    this.changeTempScale = this.changeTempScale.bind(this);
    this.getTemp = this.getTemp.bind(this);
    this.logState = this.logState.bind(this);
  }

  componentDidMount() {
    navigator.geolocation
      .getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude.toFixed(2),
            longitude: position.coords.longitude.toFixed(2),
            error: null
          });
        },
        error => this.setState({ error: true }),
        //makes the function call high accuracy for 20 seconds at max
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      )
  }

  getTemp() {
      axios
        .get("http://api.openweathermap.org/data/2.5/forecast", {
          params: {
            APPID: "ce8af8b27335a58a4a597637fbdf7ec8",
            lat: `${this.state.latitude}`,
            lon: `${this.state.longitude}`
          }
        })
        .then(res => {
          console.log(res.data);
          this.setState({
            weather: res.data.list
          })

        }).catch(err => {
          console.log(err);
        })
  }

  logState() {
    console.log(this.state.weather);
  }

  //change from fahrenheit to celcius to kelvin
  changeTempScale() {
    this.state.tempScale === "fahrenheit"
      ? this.setState({ tempScale: "celcius" })
      : this.setState({ tempScale: "fahrenheit" });
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <h3>Five day Weather Forecast</h3>
          <p>Press the button to get your weather</p>
          <button onClick={this.getTemp}>Press Me to get your weather!</button>
          <button onClick={this.changeTempScale}>Change Temp Scale</button>
          <button onClick={this.logState}>Log State with this button</button>
          <div>Your temp scale is currently: {this.state.tempScale}</div>
          <div id="output">
            {this.state.error &&
              `Sorry, we couldn't get your location or weather`}
            {this.state.latitude && `Your Latitude is: ${this.state.latitude}`}
            <br />
            {this.state.longitude &&
              `Your Longitude is: ${this.state.longitude}`}
            <br />

            <ul>
              {
                this.state.weather.map((item, i) => {
                  <li key={i}>{item}</li>
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
