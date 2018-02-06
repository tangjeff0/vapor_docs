import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Button, Icon, Row, Input, Modal} from 'react-materialize';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      docId: '',
      docPassword: '',
      lockedDoc: true,
      user: null,
      mongoStore: null,
      docs: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.checkDocPassword = this.checkDocPassword.bind(this);
  }

  componentDidMount() {
    const objUser = JSON.parse(localStorage.getItem('user'));
    this.setState({user: objUser || null});
    if (!this.state.mongoStore && objUser) {
      axios.post(localStorage.getItem('url') + '/login', objUser) // XXX
      .then(resp => {
        this.setState({docs: resp.data.docs, mongoStore: true});
      });
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

  loginUser() {
    axios.post(localStorage.getItem('url') + '/login', this.state) // XXX
    .then(resp => {
      if(resp.data.user) {
        const strUser = JSON.stringify(resp.data.user);
        localStorage.setItem('user', strUser);
        this.setState({user: resp.data.user, docs: resp.data.docs});
      }
    });
  }

  logoutUser() {
    axios.get(localStorage.getItem('url') + '/logout') // XXX
    .then(resp => {
      localStorage.setItem('user', null);
      this.setState({user: null});
    });
  }

  checkDocPassword() {
    axios.post(localStorage.getItem('url') + '/checkDocPassword', { // XXX
      docId: this.state.docId,
      docPassword: this.state.docPassword,
    })
    .then(resp => {
      this.setState({progressBar: true});
      if (resp.data.wasCorrectPassword) { this.setState({lockedDoc: false}); }
      else {
        // TODO give visual feedback
        console.log('wrong password :(!', resp);
      }
    })
    .catch(err => { console.log({err}); });
  }

  render() {
    if (this.state.user) {
      return (
        <div className="loggedin-homepage">
          <Button onClick={this.logoutUser} waves='light' className='blue darken-2' style={{alignSelf: 'flex-start', position: 'absolute', marginLeft: '20px',  marginTop: '20px'}}>l o g o u t<Icon left>navigate_before</Icon></Button>
          <h2 style={{color: '#1976d2', fontStyle: 'italic'}} >// <b>\/ /\</b> P O R D O C S </h2>
          <div>
            <Link to="/newEditor"><Button floating large className='blue darken-2' waves='light' icon='add'>Create a new document</Button></Link>
          </div>
          <div className="doc-container">
            {this.state.docs.map((doc, idx) => (
              <p key={doc._id}>
                <a href='#' style={{fontStyle: 'italic', color: idx % 2 === 0 ? '#31bfb4' : null, fontSize: '2em'}} onClick={() => {
                  this.setState({docId: doc._id});
                  $('#docPasswordModal').modal('open');
                }}>
                  ~> {doc.title}
                </a>
              </p>
            ))}
          </div>

        <Modal
          id='docPasswordModal'
          header='P /\ S S \/\/ O R D'
          actions={
            this.state.lockedDoc ?
              <Button onClick={this.checkDocPassword} waves='light' className="blue darken-2">u n l o c k<Icon left>lock</Icon></Button>
              :
              <Link to={'/doc/' + this.state.docId}>
                <Button onClick={() => $('#docPasswordModal').modal('close')} waves='light' className="blue darken-2">g o<Icon left>exit_to_app</Icon></Button>
              </Link>
          }
        >
          <Input onChange={this.handleInputChange} value={this.state.docPassword} name="docPassword" type="password" label="p a s s w o r d" s={12} />
        </Modal>
        </div>
      );
    }

    return (
      <div className="home-page">
        <div className="color-overlay"></div>
        <div style={{color: 'white', zIndex: 4, textAlign: 'center'}}>
        <h2 style={{color: 'pink', fontStyle: 'italic'}}> // <b>\/ /\</b> P O R D O C S </h2>
        <Row>
          <Input onChange={this.handleInputChange} value={this.state.username} name="username" type="text" label="u s e r n a m e" s={12} />
          <Input onChange={this.handleInputChange} value={this.state.password} name="password" type="password" label="p a s s w o r d" s={12} />
        </Row>
        <Button onClick={this.loginUser} className='blue darken-2' waves='light'>l o g i n<Icon left>exit_to_app</Icon></Button>
        </div>
      </div>
    );
  }
}

export default Home;
