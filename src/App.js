import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import * as Ionicons from "react-icons/lib/io";

const weatherStyle = {
  listStyleType: "none",
  margin: "0px",
  border: "1px solid black",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  padding: "6px 16px"
};

class App extends Component {
  constructor(props) {
    super(props);
    //set the states as undefined at first
    //fill these with info from the api
    this.state = {
      //what we'll set from getLocation() call
      longitude: undefined,
      latitude: undefined,
      weather: [],
      tempScale: "Fahrenheit",
      // After the openweathermap call

      city: "",
      country: "",
      humidity: "",

      //show error message if this is true
      error: undefined
    };

    //bind the methods so we can use them
    this.changeTempScale = this.changeTempScale.bind(this);
    this.getTemp = this.getTemp.bind(this);
    this.logState = this.logState.bind(this);
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
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
    );
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
        });
      })
      .catch(err => {
        console.log(err);
      });
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
          <button onClick={this.logState}>Log State with this button</button>

          <div id="output">
            {this.state.error &&
              `Sorry, we couldn't get your location or weather`}
            {this.state.latitude && `Your Latitude is: ${this.state.latitude}`}
            <br />
            {this.state.longitude &&
              `Your Longitude is: ${this.state.longitude}`}
            <br />
            {this.state.weather.length > 1 ? (
              <ul>
                {this.state.weather.map((items, index) => (
                  <li key={index} style={weatherStyle}>
                    Time:{" "}
                    {new Date(items.dt * 1000).toLocaleDateString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                    <br />
                    Temperature:{" "}
                    {this.state.tempScale === "Fahrenheit"
                      ? `${((items.main.temp - 273.15) * 1.8 + 32).toFixed(
                          1
                        )}°F`
                      : `There seems to be an error fetching your temperature results`}
                    <br />
                    Humidity: {`${items.main.humidity}%`}
                    <br />
                    {/* If the time is between 6AM and 6PM then render a sun */}
                    {/* Between 11 and 23 because there is a 5 hour time differential */}
                    {items.weather[0].main === "Clear" &&
                    (parseInt(items.dt_txt.slice(11, 13), 10) >= 11 &&
                      parseInt(items.dt_txt.slice(11, 13), 10) <= 23) ? (
                      <Ionicons.IoIosSunny fontSize="70px" />
                    ) : null}
                    {/* Render a moon icon if the time is past 6PM but before 6AM*/}
                    {/* Between 11 and 23 because there is a 5 hour time differential */}
                    {items.weather[0].main === "Clear" &&
                    (parseInt(items.dt_txt.slice(11, 13), 10) < 11 ||
                      parseInt(items.dt_txt.slice(11, 13), 10) > 23) ? (
                      <Ionicons.IoIosMoon fontSize="70px" />
                    ) : null}
                    {items.weather[0].main === "Clouds" ? (
                      <Ionicons.IoIosCloudy fontSize="70px" />
                    ) : null}
                    {items.weather[0].main === "Snow" ? (
                      <Ionicons.IoIosSnowy fontSize="70px" />
                    ) : null}
                    {items.weather[0].main === "Rain" &&
                    items.weather[0].description !== "moderate rain" ? (
                      <Ionicons.IoIosRainy fontSize="70px" />
                    ) : null}
                    {items.weather[0].description === "moderate rain" ? (
                      <Ionicons.IoIosThunderstorm fontSize="70px" />
                    ) : null}
                    <br />
                    Weather: {items.weather[0].description}
                    <br />
                    Wind speed: {`${items.wind.speed} mph`}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
