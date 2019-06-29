import React from 'react';
import { BrowserRouter as Router,Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>
          <Route exact path="/" component={Landing}></Route>

          <div className="container">
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={Login}></Route>

          </div>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
