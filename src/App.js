import React, { Component, createRef } from "react";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";
import "bootstrap/dist/css/bootstrap.min.css";

// Initial data below the imports
const initialData = [
  { id: 1, country: "Japan", location: "Tokyo", date: "2025-04-01" },
  { id: 2, country: "France", location: "Paris", date: "2025-06-15" },
  { id: 3, country: "Italy", location: "Rome", date: "2025-08-20" },
];

// Main component - assembles child components, no state needed
class Main extends Component {
  render() {
    return (
      <div className="container my-4">
        <h1 className="text-center mb-4">Travel App</h1>
        <AddCountryForm addCountry={this.props.addCountry} />
        <h2 className="mt-4">Countries to Visit</h2>
        <h3 className="h5 text-muted">Destination List</h3>
        <h4 className="h6 text-muted mb-3">All entries from Redux state</h4>
        <CountriesList countries={this.props.countries} />
      </div>
    );
  }
}

// 2nd child component - displays data from state
class CountriesList extends Component {
  render() {
    return (
      <div className="countries-list">
        <CountriesDisplay countries={this.props.countries} />
      </div>
    );
  }
}

// Component that displays all data in state (called in CountriesList)
function CountriesDisplay({ countries }) {
  return (
    <ul className="list-group">
      {countries.map((item) => (
        <li key={item.id} className="list-group-item">
          <strong>{item.country}</strong> - {item.location} ({item.date})
        </li>
      ))}
    </ul>
  );
}

// 1st child component - form with refs
class AddCountryForm extends Component {
  constructor(props) {
    super(props);
    this.countryRef = createRef();
    this.locationRef = createRef();
    this.dateRef = createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const country = this.getRefValue(this.countryRef);
    const location = this.getRefValue(this.locationRef);
    const date = this.getRefValue(this.dateRef);
    if (country && location && date) {
      this.props.addCountry({ country, location, date });
      this.clearRefs();
    }
  };

  getRefValue = (ref) => {
    return ref.current ? ref.current.value.trim() : "";
  };

  clearRefs = () => {
    if (this.countryRef.current) this.countryRef.current.value = "";
    if (this.locationRef.current) this.locationRef.current.value = "";
    if (this.dateRef.current) this.dateRef.current.value = "";
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="card p-3 mb-4">
        <div className="mb-2">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="text"
            id="country"
            className="form-control"
            ref={this.countryRef}
            placeholder="Enter country"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="form-control"
            ref={this.locationRef}
            placeholder="Enter location"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="text"
            id="date"
            className="form-control"
            ref={this.dateRef}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Country
        </button>
      </form>
    );
  }
}

// Redux action creator
function addCountry(payload) {
  return {
    type: "ADD_COUNTRY",
    payload,
  };
}

// Redux reducer
function travelReducer(state = initialData, action) {
  switch (action.type) {
    case "ADD_COUNTRY":
      return [
        ...state,
        {
          id: state.length ? Math.max(...state.map((i) => i.id)) + 1 : 1,
          ...action.payload,
        },
      ];
    default:
      return state;
  }
}

// Redux store and connection helpers
const store = createStore(travelReducer);

function mapStateToProps(state) {
  return {
    countries: state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addCountry: (payload) => dispatch(addCountry(payload)),
  };
}

const ConnectedMain = connect(mapStateToProps, mapDispatchToProps)(Main);

// App component - Provider wraps connected main so nested components access Redux state
function App() {
  return (
    <Provider store={store}>
      <ConnectedMain />
    </Provider>
  );
}

export default App;
