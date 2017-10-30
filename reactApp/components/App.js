import React from 'react';
import MyEditor from './MyEditor';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <h1>Collaborative Text editor</h1>
        <MyEditor />
      </div>
    );
  }
}

export default App;
