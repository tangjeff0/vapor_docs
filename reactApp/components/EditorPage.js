import React from 'react';
import MyEditor from './MyEditor';
import {Link} from 'react-router-dom';
import {Icon} from 'react-materialize';
import io from 'socket.io-client';

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    /* const socket = io("http://10.2.106.91:3000/"); */
    const socket = io("http://localhost:3000/");
    this.state = {
      socket
    };

  }
  componentDidMount() {
    console.log("this.state socket", this.state.socket);
    this.state.socket.emit('connection', this.props.docId);
  }
  render() {
    return (
      <div className="container" style={{backgroundColor: '#2bbbad', paddingTop: '20px', paddingLeft: '40px', position:'absolute', width: '100%', height: '100%', top: '0', left: '0'}}>
        <Link style={{color: 'white', marginBottom: '15px'}} to="/"><Icon>arrow_back</Icon></Link>
        <MyEditor docId={this.props.docId} socket={this.state.socket}/>
      </div>
    );
  }
}

export default EditorPage;
