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
      <div className="container" style={{paddingTop: '20px'}}>
        <Link to="/"> Back </Link>
        <h4>Collaborative Text editor</h4>
        <MyEditor />
      </div>
    );
  }
}

export default EditorPage;
