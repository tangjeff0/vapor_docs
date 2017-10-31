import React from 'react';
import MyEditor from './MyEditor';
import {Link} from 'react-router-dom';
import {Icon} from 'react-materialize';

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container" style={{backgroundColor: '#2bbbad', paddingTop: '20px', paddingLeft: '40px', position:'absolute', width: '100%', height: '100%', top: '0', left: '0'}}>
        <Link style={{color: 'white', marginBottom: '15px'}} to="/"><Icon>arrow_back</Icon></Link>
        <MyEditor />
      </div>
    );
  }
}

export default EditorPage;
