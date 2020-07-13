import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
//  Fais dans to terminal  npm i --save query-string
import queryString from 'query-string';
import  Connexion  from './Connexion.js';
import "./css/Home.css";

// Une fois arriver sur cette page, tu dois verifier que l'utilisateur est bien conncté et recupere son token
export class Home extends Component {
    constructor(props) {
      super(props);
      // Cree une variable dans laquel tu vas stoker le token 
      let login_data = null
      // Recupere ce que Auth0 va te retourner apres la connexion
      const code = queryString.parse(this.props.location.search)

      // Verifie si code est differnt de NULL si oui, stocke le dans login data et fais un console.log pour voir ce qu'il y a à l'interieurstocke le dans un state et c'est carré mon gars !!!
      if(code.code !== null){
        login_data = code.code
      }

      this.state = {
        active: true,
        displayMovie: false,
        displaySerie: true,
        itemSerie: [],
        itemMovie: [],
        user: [],
        code: login_data
      }

      this.handleChange = this.handleChange.bind(this);
    }

    //TODO récuperation des données de connexion utilisateur

    componentDidMount() {
      if(localStorage.getItem('token') === null && this.state.code !== null){
        const Data = {
          client_id : '1130fe9fd334',
          client_secret : '08d4b4b77b660f8322a77d70edead575',
          redirect_uri : 'http://localhost:3000/Previously_On/home',
          code: this.state.code
        }
        axios.post('https://api.betaseries.com/members/access_token', Data)
        .then((res) => {
          this.setState({ user: res.data.user })
          localStorage.setItem('user_id', res.data.user.id)
          localStorage.setItem('user_xp', res.data.user.xp)
          localStorage.setItem('user_in_account', res.data.user.in_account)
          localStorage.setItem('token', res.data.token)
        }).catch((error) => {
            console.log(error)
        });
      }

      //TODO Affichage des series par popularité
      axios({
        method: 'get',
        url: 'https://api.betaseries.com/shows/list?key=1130fe9fd334&order=popularity&limit=20',
      })
      .then(response => {
        this.setState({ itemSerie: response.data.shows });
      })
      .catch(function(err) {
        console.log(err);
      })

      //TODO affichage des films par popularité

      axios({
        method: 'get',
        url: 'https://api.betaseries.com/movies/list?key=1130fe9fd334&order=popularity'
      })
      .then(response => {
        this.setState({ itemMovie: response.data.movies });
      })
      .catch(function(err) {
        console.log(err);
      })

    }

    handleChange(event) {
      if(event.target.value === "movies"){
        this.setState({ displayMovie: true, displaySerie: false, active: false });
      } else {
        this.setState({ displayMovie: false, displaySerie: true, active: true });
      }
    }

    //TODO Ajout d'un film ou série à la liste "déja vu"

    handleAdd(event) {
      axios({
        method: 'post',
        url: `https://api.betaseries.com/shows/show?v=3.0&key=1130fe9fd334&access_token=${localStorage.getItem('token')}&id=${event.target.id}`
      })
      .then(response => {
        console.log(response.data)
      })
      .catch(function(err) {
        console.log(err);
      })
    }

    render() {
      var display = "";
      if(localStorage.getItem("user_id")) {
        this.state.displaySerie ?
          display = (
            <div className='article_series'>
              {this.state.itemSerie.map(e => {
                let image =
                  e.images.poster !== null ? e.images.poster : "https://www.questhandi.fr/wp-content/uploads/2016/07/inconnu.jpg";
                return (
                  <React.Fragment key ={e.title}>
                    <div className='single_article'>
                        <div className="head">
                          <Link to={{
                            pathname: '/Previously_On/detail',
                            state: {
                              all: e
                            }
                          }}>
                            <img src={image} height="325" alt="poster"/>
                          </Link>
                          <button id={e.id} onClick={this.handleAdd}>+</button>
                        </div>
                      <Link to={{
                        pathname: '/Previously_On/detail',
                        state: {
                          all: e
                        }
                      }}>
                        <p>{e.title}</p>
                      </Link>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) :
          display = (
            <div className='article_movies'>
              {this.state.itemMovie.map(e => {
                return(
                  <React.Fragment>
                    <h1>Movies</h1>
                  </React.Fragment>
                )
              })}
            </div>
          );
      } else {
        this.state.displaySerie ?
          display = (
            <div className='article_series'>
              {this.state.itemSerie.map(e => {
                let image =
                  e.images.poster !== null ? e.images.poster : "https://www.questhandi.fr/wp-content/uploads/2016/07/inconnu.jpg";
                return (
                  <React.Fragment key ={e.id}>
                    <div className='single_article'>
                      <Link to={{
                        pathname: '/Previously_On/detail',
                        state: {
                          all: e
                        }
                      }}>
                        <div className="head">
                          <img src={image} height="325" alt="poster"/>
                        </div>
                        <p>{e.title}</p>
                      </Link>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) :
          display = (
            <div className='article_movies'>
              {this.state.itemMovie.map(e => {
                return(
                  <React.Fragment>
                    <h1>Movies</h1>
                  </React.Fragment>
                )
              })}
            </div>
          );
      }

      return (
        <Fragment>
          <Connexion/>

          <div className="container">
            <div className="choice">
              <button className={"active-" + (this.state.active ? 'show' : 'hidden')} onClick={this.handleChange} value="series">Série(s)</button><button className={"active-" + (this.state.active ? 'hidden' : 'show')} onClick={this.handleChange} value="movies">Movie(s)</button>
            </div>
            <div className="subcontainer">
              {display}
            </div>
          </div>
        </Fragment>
      )
    }
  }

  export default Home;
