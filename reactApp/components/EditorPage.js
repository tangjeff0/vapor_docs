import React from 'react';
import MyEditor from './MyEditor';

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <h3>Collaborative Text editor</h3>
        <MyEditor />
      </div>
    );
  }
}

export default EditorPage;
