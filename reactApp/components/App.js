import React from 'react';
import EditorPage from './EditorPage';
import Home from './Home';
import {Route} from 'react-router-dom';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/newEditor" component={EditorPage} />
        <Route path="/doc/:docId" render={(props) => {
          return <EditorPage docId={props.match.params.docId} />;
        }} />
      </div>
    );
  }
}

export default App;