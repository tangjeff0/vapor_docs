import React from 'react';
import axios from 'axios';
import {Button, Icon, Row, Input} from 'react-materialize';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.logInUser = this.logInUser.bind(this);
  }



  handleInputChange(event) {
    const target = event.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  logInUser() {
    console.log("THISSTATE", this.state);
    axios.post(process.env.BACKEND_URL + '/user/findOrCreate', this.state)
    .then(function(response) {
      console.log("RESPONSE", response);
    });
  }

  render() {
    return (
      <div className="container home-page">
        <div className="color-overlay"></div>
        <div style={{color: 'white', zIndex: 4, textAlign: 'center'}}>
        <h2 style={{color: 'white'}}> DocTings </h2>
        <Row>
          <Input onChange={this.handleInputChange} value={this.state.username} name="username" type="text" label="Username" s={12} />
          <Input onChange={this.handleInputChange} value={this.state.password} name="password" type="password" label="password" s={12} />
        </Row>
        <Button onClick={this.logInUser} waves='light'>Log in to Docs<Icon left>exit_to_app</Icon></Button>
        </div>
      </div>
    );

  }
}

export default Home;
