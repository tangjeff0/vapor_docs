import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import axios from 'axios';

import InlineStyleControls from './InlineStyleControls';
import BlockStyleControls from './BlockStyleControls';

const styleMap = {
  RED :{
    color: 'red'
  },
  BLUE: {
    color: 'blue'
  },
  GREEN: {
    color: 'green'
  },
  SMALL: {
    fontSize: '10px'
  },
  NORMAL: {
    fontSize: '15px'
  },
  LARGE: {
    fontSize: '20px'
  },
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.domEditor.focus();
    this._toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this._toggleBlockStyle = this._toggleBlockStyle.bind(this);
    this.setDomEditorRef = ref => this.domEditor = ref;
  }

  componentDidMount(){
    this.domEditor.focus();
  }
  // componentDidMount() {
  //   this.getDocContents();
  // }
  // getDocContents() {
  //   axios.get(process.env.BACKEND_URL + '/doc/' + this.props.match.params.id)//TODO verify correct params
  //   .then(resp => this.setState({editorState: resp.body.contents}))
  //   .catch(err => console.log('Error getting contents:', err));
  // }
  //
  //
  // // SOME OTHER FUNCTIONS FOR THE OTHER PAGES
  //
  // // Login/Register page => onKeyPress, onSubmit
  // handleChange(key) {
  //   return (e) => {
  //     const state = {};
  //     state[key] = e;
  //     this.setState(state);
  //   };
  // }

  /* onSubmit() {//depending on the React Route, change the postUrl onSubmit */
  /*   const postUrl = this.props.match.params.loginOrRegister === '/register' ? '/user/new' : '/user/login'; */
  /*   axios.post(process.env.BACKEND_URL + postUrl, { */
  /*     username: this.state.username, */
  /*     password: this.state.password, */
  /*   }); */
  /* } */

  // Home page => load docs
  // compondentDidMount() {
  //   this.getDocs();
  // }
  // getDocs() {
  //   axios.get(process.env.BACKEND_URL + '/docs')
  //     .then(resp => this.setState({docs: resp.docs}))
  //     .catch(err => console.log('Error getting docs:', err));
  // }

  /* onNewDoc(e) { */
  /*   axios.post(process.env.BACKEND_URL + '/doc/new', { */
  /*     password: e.target.value */
  /* } */

  _toggleBlockStyle(blockType) {
    this.onChange(
            RichUtils.toggleBlockType(
              this.state.editorState,
              blockType
            )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    let className = 'RichEditor-editor';
    const {editorState} = this.state;
    return (
      <div className="RichEditor-root">
      <BlockStyleControls editorState={editorState} onToggle={this._toggleBlockStyle}
      />
      <InlineStyleControls
          editorState={editorState}
          onToggle={this._toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor blockStyleFn={getBlockStyle} spellCheck={true} customStyleMap={styleMap} ref={this.setDomEditorRef} editorState={this.state.editorState} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}
const getBlockStyle = (block) => {

  switch (block.getType()) {
  case 'left':
    return 'align-left';
  case 'center':
    return 'align-center';
  case 'right':
    return 'align-right';
  default:
    return null;
  }
};
export default MyEditor;
