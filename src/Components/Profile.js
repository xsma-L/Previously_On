import React, { Component, Fragment } from 'react';
import "./css/Profile.css";
import { Redirect } from 'react-router';
import  Connexion  from './Connexion.js';
import axios from "axios";

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      me: []
    }
  }

  componentDidMount() {

    axios({
      method: 'get',
      url: `https://api.betaseries.com/members/infos?key=1130fe9fd334&id=${localStorage.getItem("user_id")}`
    })
    .then(response => {
      this.setState({ me: response.data.member })
    })
    .catch(function(err) {
      console.log(err);
    })

    axios({
      method: 'get',
      url: `https://api.betaseries.com/members/year?key=1130fe9fd334&id=${localStorage.getItem("user_id")}&year=2020`
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  render() {
    console.log(this.state.me)
    if(localStorage.length < 1) {
      var redirect = <Redirect to='/Previously_On/home'/>
    }

    var avatar
    var banner

    if(this.state.me.avatar === null) {
      avatar = <img className="pp" width="200" src="https://cdn2.iconfinder.com/data/icons/audio-16/96/user_avatar_profile_login_button_account_member-512.png" alt="avatar"/>
    } else {
      avatar = <img className="pp" width="200" src={this.state.me.avatar} alt="avatar"/>
    }

    if(this.state.me.profile_banner === null) {
      banner = <img className="banner" src="https://edimea.com/wp-content/uploads/2013/09/banniere-vierge.jpg" alt="banner" />
    } else {
      banner = <img className="banner" src="this.state.me.profile_banner" alt="banner" />
    }

    return(
      <Fragment>
        {redirect}
        <Connexion/>
        <div className="container4">
          {banner}
          <div className="infos">
            {avatar}
            <div className="infos-bis">
              <p>{this.state.me.login}</p>
              <p>Année d'inscription — {this.state.me.subscription}</p>
              <p>XP — {this.state.me.xp}</p>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Profile;
