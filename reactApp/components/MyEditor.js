import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import {Button, Icon, Input, Modal} from 'react-materialize';
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
    this.state = {
      editorState: EditorState.createEmpty(),
      docId: '',
      password: '',
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.domEditor.focus();
    this._toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this._toggleBlockStyle = this._toggleBlockStyle.bind(this);
    this.setDomEditorRef = ref => this.domEditor = ref;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveDoc = this.saveDoc.bind(this);
    this.saveModal = this.saveModal.bind(this);
  }

  componentDidMount(){
    this.domEditor.focus();
  }

  handleInputChange(event) {
    const target = event.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  saveDoc() {
    if (!this.state.docId) {
      $('#saveModal').modal('open');
    }
    else {
      axios.put('http://localhost:3000/doc/' + this.state.docId, {
        contents: JSON.stringify(this.state.editorState.getCurrentContent()),
      })
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  saveModal() {
    axios.post('http://localhost:3000/doc/new', {
      password: this.state.password,
    })
    .then(resp => {
      console.log(resp);
      this.setState({docId: resp.data.doc._id});
      $('#saveModal').modal('close');
    })
    .catch(err => {
      console.log(err);
    });
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
      <div className="wrapper">
      <div className="RichEditor-root">
      <BlockStyleControls editorState={editorState} onToggle={this._toggleBlockStyle} />
      <InlineStyleControls
          editorState={editorState}
          onToggle={this._toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor blockStyleFn={getBlockStyle} spellCheck={true} customStyleMap={styleMap} ref={this.setDomEditorRef} editorState={this.state.editorState} onChange={this.onChange} />
        </div>
      </div>

			<Modal
				id='saveModal'
				header='New DocTing - please enter password'
        actions={<Button onClick={this.saveModal} waves='light' className="save-doc">Save<Icon left>save</Icon></Button>}
      >
				<Input onChange={this.handleInputChange} value={this.state.password} name="password" type="password" label="password" s={12} />
			</Modal>

      <Button onClick={this.saveDoc} waves='light' className="save-doc">Save<Icon left>save</Icon></Button>

      </div>
    );
  }
}

			/* <Modal */
			/* 	trigger={ */
          /* this.state.docId? null : */
        /* } */
      /* > */
			/* </Modal> */

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
