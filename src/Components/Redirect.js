import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'

export class Redirection extends Component {
    constructor(props) {
      super(props);
      this.state = {
    
      }
    }
  
    //TODO redirection vers "/Prevously_ON/home"
    
    render() {
      return(
        <Redirect to='/Previously_On/home' />
      )
    }
  }
  
  export default Redirection;
  