import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import './css/Friends.css'
import  Connexion  from './Connexion.js';
import axios from 'axios';
import Modal from 'react-responsive-modal';

export class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      blocked: [],
      member_search: [],
      friends_query: [],
      find: null,
      redirect: false,
      open: false
    }
  }

  componentDidMount(){
    const token = localStorage.getItem('token')
    if(token === null){
      this.setState({
        redirect: true
      })
    }
    this.get_friends()
    this.get_blocked_friends()
    this.get_friends_request()
  }

  change = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  //TODO RECHERCHE DE MEMBRE
  submit = e => {
    e.preventDefault();
    axios({
      method: 'get',
      url: `https://api.betaseries.com/search/all?v=3.0&key=1130fe9fd334&query=${this.state.find}&limit=7`,
    })
    .then(response => {
      this.setState({
        member_search: response.data.users
      });
      this.onOpenModal()
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  //TODO affichage u Modal de recherche d'amis
  onOpenModal = () => {
    this.setState({ open: true });
  };
 
  onCloseModal = () => {
    this.setState({ open: false });
  };

  //TODO récuperes les amis
  get_friends = () =>{
    if(localStorage.getItem('token') !== null){
      var token = localStorage.getItem('token')
      var user_id = localStorage.getItem('user_id')
    }
    axios({
      method: 'get',
      url: `https://api.betaseries.com/friends/list?access_token=${token}&v=3.0&key=1130fe9fd334&id=${user_id}`,
    })
    .then(response => {
      this.setState({
        friends: response.data.users
      });
    })
    .catch(function(err) {
      console.log(err);
    })
  } 

  //TODO recupere les amis bloqués

  get_blocked_friends = () =>{
    if(localStorage.getItem('token') !== null){
      var token = localStorage.getItem('token')
    }
    axios({
      method: 'get',
      url: `https://api.betaseries.com/friends/list?access_token=${token}&v=3.0&key=1130fe9fd334&blocked=true`,
    })
    .then(response => {
      this.setState({
        blocked: response.data.users
      });
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  //TODO fonction de recuperation de demandes d'ajouts
  
  get_friends_request = () =>{
    if(localStorage.getItem('token') !== null){
      var token = localStorage.getItem('token')
    }
      axios({
        method: 'get',
        url: `https://api.betaseries.com/friends/requests?access_token=${token}&v=3.0&key=1130fe9fd334&blocked=true`,
      })
      .then(response => {
        if(response !== []){
          this.setState({
            friends_query: response.data.users
          });
        }
      })
      .catch(function(err) {
        console.log(err);
      })
  }

  //TODO fonction d'ajout d'amis

  add_friends(id){
    var token = localStorage.getItem('token')
    const Data = {
      v: '3.0',
      key: '1130fe9fd334',
      token: token,
      id: id
    }

    axios.post('https://api.betaseries.com/friends/friend', Data)
    .then((res) => {
      this.get_friends()
      this.get_blocked_friends()
      this.onCloseModal()
    }).catch((error) => {
        console.log(error)
    });
  }

  //TODO fonction de blocage d'amis

  block(id){
    var token = localStorage.getItem('token')

    const Data = {
      v: '3.0',
      key: '1130fe9fd334',
      token: token,
      id: id
    }

    axios.post('https://api.betaseries.com/friends/block', Data)
    .then((res) => {
      this.get_friends()
      this.get_blocked_friends()
    }).catch((error) => {
        console.log(error)
    });
  }

  //TODO fontion de déblocage d'amis

  unlock_friends = (id) =>{
    var token = localStorage.getItem('token')

    axios.delete(`https://api.betaseries.com/friends/block?v=3.0&key=1130fe9fd334&token=${token}&id=${id}`)
    .then((res) => {
      console.log(res.data)
      this.get_friends()
      this.get_blocked_friends()
    }).catch((error) => {
        console.log(error)
    });
  }

  //TODO fontion de suppresion d'amis

  delete = (id) =>{
    var token = localStorage.getItem('token')

    axios.delete(`https://api.betaseries.com/friends/friend?v=3.0&key=1130fe9fd334&token=${token}&id=${id}`)
    .then((res) => {
      console.log(res.data)
      this.get_friends()
      this.get_blocked_friends()
    }).catch((error) => {
        console.log(error)
    });
  }


  render() {
    var redirect
    if(this.state.redirect){
      redirect = <Redirect to={{ pathname: '/Previously_On/home' }}/>
    }
    const numRows = this.state.friends.length
    const numRows_2 = this.state.blocked.length
    const numRows_3 = this.state.friends_query.length
    const numRows_find = this.state.member_search.length
    const { open } = this.state;

    return (
      <div>
      {redirect}
        <Connexion />
        <Modal  open={open} onClose={this.onCloseModal} center>
          {numRows_find > 0 ?
            this.state.member_search.map((key, value) =>
              <div key={value}>
                <h3>{key.login}</h3>
                <button onClick = { () => this.add_friends(key.id) }>Ajouter à mes amis</button>
              </div>            
            ) : ""
          }
        </Modal>
        <div className="user_search">
          <form onSubmit={this.submit}>
            <button type='Submit'>Rechercher un membre</button>
            <input type='text' id='find' onChange={this.change}></input>
          </form>
        </div>
        <div className="friends_tab">
          <div className="friends_menu">
            <h2>Mes amis</h2>
          {numRows > 0 ?
            this.state.friends.map((key, value) =>
              <div key={value}>
                <h3>{key.login}</h3>
                <button onClick = { () => this.block(key.id)}>Bloquer</button>
                <button onClick = { () => this.delete(key.id)}>Supprimer</button>
              </div>            
            ) : 
              <div>
                <h3>Vous n'avez pas encore d'amis</h3>
              </div> 
          }
          </div>
          <div className="friends_blocked">
            <h2>Mes amis bloqués</h2>
          {numRows_2 > 0 ?
            this.state.blocked.map((key, value) =>
              <div key={value}>
                <h3>{key.login}</h3>
                <button onClick = { () => this.unlock_friends(key.id)}>Débloquer</button>
              </div>            
            ) :
              <div>
                <h3>Vous n'avez aucun amis bloqués</h3>
              </div> 
          }
          </div>
          <div className="friends_blocked">
            <h2>Mes demandes d'ajout</h2>
          {numRows_3 > 0 ?
            this.state.friends_query.map((key, value) =>
              <div key={value}>
                <h3>{key.login}</h3>
                <button onClick = { () => this.add_friends(key.id)}>Débloquer</button>
              </div>            
            ) : 
              <div>
                <h3>Vous n'avez aucune demande d'ajout</h3>
              </div> 
          }
          </div>
        </div>
      </div>
    )
  }
}

  export default Friends;
