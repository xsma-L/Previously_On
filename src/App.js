import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Redirection from './Components/Redirect.js';
import 'bootstrap/dist/css/bootstrap.min.css';        
import Home from './Components/Home.js';
import Friends from './Components/Friends.js';
import Details from './Components/Details.js';
import Profile from './Components/Profile.js';

function App() {
  return (
    <Router>
      <Route exact path="/" component={ Redirection } />
      <Route exact path="/Previously_On/home" component={ Home } />
      <Route exact path="/Previously_On/detail" component={ Details } />
      <Route path="/Previously_On/friends" component={ Friends } />
      <Route path="/Previously_On/profile" component={ Profile } />
    </Router>
  );
}

export default App;
