import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Button, Icon, Row, Input} from 'react-materialize';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      user: false,
      docs: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.logInUser = this.logInUser.bind(this);
  }


  componentDidMount() {
    if(localStorage.getItem('user')) {
      this.setState({user: localStorage.getItem('user')});
    }
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
    const self = this;
    axios.post('http://localhost:3000' + '/user/findOrCreate', this.state)
    .then(function(response) {
      if(response.data.user) {
        localStorage.setItem('user', response.data.user);
        self.setState({user: response.data.user, docs: response.data.docs});
      }
    });
  }

  render() {
    if(this.state.user) {
      return (
        <div className="container loggedin-homepage">
          <h3 style={{color: 'white'}} >All your documents. In one place. </h3>
          <div className="doc-container">
            {this.state.docs.map(doc => {
              return  (
                <p>{doc.title}</p>
              );
            })}
          </div>
          <div>
          <Link to="/newEditor"><Button floating large className='red' waves='light' icon='add'>Create a new document </Button></Link>
          </div>
        </div>
      );
    }
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
