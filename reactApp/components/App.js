import React from 'react';
import EditorPage from './EditorPage';
import Home from './Home';
import {Route} from 'react-router-dom';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    localStorage.setItem("url", "https://vapordocs.herokuapp.com");
    return (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/newEditor" component={EditorPage} />
        <Route path="/doc/:docId" render={props => <EditorPage docId={props.match.params.docId} /> } />
      </div>
    );
  }
}

export default App;
