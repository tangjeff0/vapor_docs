import {Editor, EditorState, RichUtils} from 'draft-js';
import InlineStyleControls from './InlineStyleControls';
import React from 'react';
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
  }

};
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
    this._toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  _toggleInlineStyle(inlineStyle) {
    console.log("inlineStyle", inlineStyle);
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
    console.log("editorState", editorState);
    return (
      <div className="RichEditor-root">
      <InlineStyleControls
          editorState={editorState}
          onToggle={this._toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor spellCheck={true} customStyleMap={styleMap} ref="editor" editorState={this.state.editorState} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default MyEditor;
