import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url:"http://localhost:3000/"
    }
}
  

render() {
    
    return (
      <Router>
        <div className="App">
          <Route path="/" render={props =>
            (
              <React.Fragment>
                <Login url={this.state.url+'users/authenticate'}/>
              </React.Fragment>
            )
          } />

        </div>
      </Router>
    );
  }
}

export default App;
