import React from 'react';
import './App.css';

const API_KEY = "fae3b5188605557014e24bd343d2256e";
const API_URL = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=fae3b5188605557014e24bd343d2256e&text=holiday&safe_search=3&content_type=1&format=json&nojsoncallback=1";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    getPhoto();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

const getPhoto = () => {
  fetch(API_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}


export default App;
