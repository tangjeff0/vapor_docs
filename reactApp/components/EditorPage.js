import React from 'react';
import MyEditor from './MyEditor';
import {Link} from 'react-router-dom';
import {Icon} from 'react-materialize';
import io from 'socket.io-client';

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    const socket = io(localStorage.getItem('url')); // XXX
    this.state = {
      socket
    };

  }
  componentDidMount() {
    this.state.socket.emit('connection', this.props.docId);
  }
  render() {
    return (
      <div className="container EditorPage" >
        <Link style={{color: 'white', marginBottom: '15px'}} to="/"><Icon className='blue-icon'>arrow_back</Icon></Link>
        <MyEditor docId={this.props.docId} socket={this.state.socket}/>
      </div>
    );
  }
}

export default EditorPage;
