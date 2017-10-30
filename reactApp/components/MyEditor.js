import {Editor, EditorState, RichUtils} from 'draft-js';
import InlineStyleControls from './InlineStyleControls';
import BlockStyleControls from './BlockStyleControls';

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
  },

};
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
    this._toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this._toggleBlockStyle = this._toggleBlockStyle.bind(this);
  }

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
          <Editor blockStyleFn={getBlockStyle} spellCheck={true} customStyleMap={styleMap} ref="editor" editorState={this.state.editorState} onChange={this.onChange} />
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
