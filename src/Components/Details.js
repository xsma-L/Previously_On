import React, { Component, Fragment } from 'react';
import "./css/Details.css";
import { Redirect } from 'react-router';
import axios from "axios";
import queryString from 'query-string';
import  Connexion  from './Connexion.js';

export class Details extends Component {
  constructor(props) {
    super(props);
    let login_data = null
    const code = queryString.parse(this.props.location.search)
    if(code.code !== null){
      login_data = code.code
    }
    this.state = {
      id: null,
      banner: null,
      title: null,
      title2: null,
      synopsis: null,
      genres: [],
      seasons: [],
      episodes: [],
      note: null,
      characters: []
    }
  }

  componentDidMount() {

    if(this.state.code !== null){
      const Data = {
        client_id : '1130fe9fd334',
        client_secret : '08d4b4b77b660f8322a77d70edead575',
        redirect_uri : 'http://localhost:3000/Previously_On/home',
        code: this.state.code
      }
      axios.post('https://api.betaseries.com/members/access_token', Data)
      .then((res) => {
        console.log(res.data)
        localStorage.setItem('user_id', res.data.user.id)
        localStorage.setItem('user_xp', res.data.user.xp)
        localStorage.setItem('user_in_account', res.data.user.in_account)
        localStorage.setItem('token', res.data.token)
      }).catch((error) => {
          console.log(error)
      });
    }

    if(this.props.location.state === undefined) {
      var redirect = <Redirect to='/Previously_On/home'/>
    } else {
      //TODO recuperation des détails des films/séries
      this.setState({
        id: this.props.location.state.all.id,
        banner: this.props.location.state.all.images.show,
        title: this.props.location.state.all.original_title,
        title2: Object.values(this.props.location.state.all.aliases)[0],
        synopsis: this.props.location.state.all.description,
        genres: this.props.location.state.all.genres,
        seasons: this.props.location.state.all.seasons_details,
        episode: this.props.location.state.all.episodes,
        note: this.props.location.state.all.notes.mean,
        vote: this.props.location.state.all.notes.total,
        duration: this.props.location.state.all.length
      });
    }
  }

  render() {

    if(this.props.location.state === undefined) {
      var redirect = <Redirect to='/Previously_On/home'/>
    } else {
      var displayGenre = Object.keys(this.state.genres).map(function(key) {
        return <p value={key}>{key}</p>
      });

      var displaySeason = this.state.seasons.map(e => {
        return (
          <React.Fragment>
              <div className="group"><p key={e.number}>Season {e.number}</p><p className="episode" key={e.episodes}>{e.episodes} Episodes</p></div>
          </React.Fragment>
        )
      });

      var displayNote = (this.props.location.state.all.notes.mean).toFixed(2);
    }

    return(
      <Fragment>
        {redirect}
        <Connexion/>

        <div className="container2">
          <img className="banner" src={this.state.banner} alt="banner"/>
          <h1>{this.state.title} <i>({this.state.title2})</i></h1>
          <h2>Synopsis</h2>
          <p>{this.state.synopsis}</p>
          <h2>Genre(s)</h2>
          <div className="genre">
            {displayGenre}
          </div>
          <h2>Season(s) & Episode(s)</h2>
          <p className="duration">Average length of an episode: {this.state.duration}min</p>
          <p className="duration">Total number of episodes: {this.state.episode}</p>
          <div className="season">
            {displaySeason}
          </div>
          <h2>Grade</h2>
          <div className="note">
            <p>{displayNote} / 5 — <i>({this.state.vote} votes)</i></p>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Details;
