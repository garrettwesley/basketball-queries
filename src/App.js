import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    loading: true,
    items: [],
    name: "",
    year: "",
    date: "",
    prevTeam: "",
    newTeam: "",
    action: ""
  };

  // Load some data from the server to demonstrate communication between
  // the client and Node
  async componentDidMount() {
    try {
      const data = await fetch('/query');
      const json = await data.json();
      this.setState({ items: json,
                      loading: false });
    } catch (e) {
      console.log("Failed to fetch message", e);
    }
  }

  async fetchData() {
    try {
      const data = await fetch('/query');
      const json = await data.json();
      this.setState({ items: json,
                      loading: false });
    } catch (e) {
      console.log("Failed to fetch message", e);
    } 
  }

  items() {
    if (this.state.loading) {
      return <p>Loading...</p>
    } else {
      const listItems = this.state.items.map(item =>
        <li key={item.name + item.year}>{item.name} in {item.year}</li>
      )
      return <ul>{listItems}</ul>
    }
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Searching for all players...
        </p>
        {this.items()}
      </div>
    );
  }
}

export default App;
