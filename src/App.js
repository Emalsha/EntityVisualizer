import React, { Component } from 'react';
import './App.css';
import EntityModel from './component/EntityModel';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
              <h1>Datenlotsen CNC Entity Model</h1>
          </div>
          <div className="App-content">
            <EntityModel />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
