import "./css/Connexion.css";
import React, {Component, Fragment} from 'react';
import { Link } from "react-router-dom";
// Tu dois faire : npm install --save auth0-js
import auth0 from 'auth0-js';

export class Connexion extends Component {
  // Tu crée la connexion dans le construct 
    constructor(props) {
      super(props);
      //TODO initialisation de WebAuth 2.0
      window.connect = this
      this.auth0 = new auth0.WebAuth({
        // tu mais le lien du site
        domain: 'www.betaseries.com/',
        // Tu mets ton code client que l'api t'as fourni 
        clientID: '1130fe9fd334',
        // Tu dois mettre une url de redirection, l'utilisateur sera auomatiquement rediriger sur cette page        apres son authentification pour mon cas c'est le fichier home.js donc je mets son url. 
        redirectUri: 'http://localhost:3000/Previously_On/home',
        //  Tu met le type de reponse que tu attends
        responseType: 'id_token',
      });
      this.state = {
        // tu créé un state qui changera si l'utilisateur est connecté 
        loged: null
      }

      // Tu mests l'appel des fonctions de connexion et de d'éconnexion
      this.signIn = this.signIn.bind(this);
      this.signOut = this.signOut.bind(this);
    }

    //TODO verification de la connexion

    componentDidMount(){
      var token = localStorage.getItem('token')
      if(token !== null){
        this.setState({ loged: true })
      }else{
        this.setState({ loged: false })
      }
    }


      signIn(e) {
        e.preventDefault();
        this.auth0.authorize();
      }

      //TODO fonction de déconnexion
      // Tu dois supprimer tout ce qui est dans le localStorage
      signOut(e) {
        e.preventDefault();
        this.setState({ loged: false })
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_xp')
        localStorage.removeItem('user_in_account')
        localStorage.removeItem('loged')
      }

      //TODO creation de la navbar
    render() {
      var log
      var profile
      var friends

      if(localStorage.getItem('token') !== null){
        friends = <a href="/Previously_On/friends">Friends</a>
      }

      if(localStorage.getItem('token') !== null){
        profile = <Link to="/Previously_On/profile">Profile</Link>
        log = <Link to="" onClick={ this.signOut }>Logout</Link>
      }else{
        profile = ""
        log = <Link to="" onClick={ this.signIn }>Login</Link>
      }

      return (
        <Fragment>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
          <div className="topnav">
            <a className="active" href="/Previously_On/home">Home</a>
            {friends}
            { profile }
            { log }
            <div className="search-container">
              <form>
                <input type="text" placeholder="Search.." name="search"/>
                <button type="submit"><i className="fa fa-search"></i></button>
              </form>
            </div>
          </div>
        </Fragment>
      )
    }
  }

  export default Connexion;
