import React from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, Modifier, SelectionState} from 'draft-js';
import {Button, Icon, Row, Input, Modal} from 'react-materialize';
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
      title: '',
      newCollab: '',
    };
    this.onChange = (editorState) => {
      this.setState({editorState});
      var selectionState = editorState.getSelection();
      var focusKey = selectionState.getFocusKey();
      // var anchorKey = selectionState.getAnchorKey();
      // var currentContent = editorState.getCurrentContent();
      // var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      // var start = selectionState.getStartOffset();
      // var end = selectionState.getEndOffset();
      // var selectedText = currentContentBlock.getText().slice(start, end);
      this.props.socket.emit('change doc', {content: JSON.stringify(convertToRaw(editorState.getCurrentContent())), room : this.state.docId, selectionState, focusKey});
    };
    this.focus = () => this.domEditor.focus();
    this._toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this._toggleBlockStyle = this._toggleBlockStyle.bind(this);
    this.setDomEditorRef = ref => this.domEditor = ref;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveDoc = this.saveDoc.bind(this);
    this.saveModal = this.saveModal.bind(this);
    this.addCollab = this.addCollab.bind(this);
    this.props.socket.on('change doc', contents => {
      console.log("CONTENETS", contents);
      let newContentState = EditorState.createWithContent(convertFromRaw(JSON.parse(contents.content)));
      let newSelectionState = SelectionState.createEmpty(contents.focusKey);
      console.log("new contentState", newContentState);
      console.log("new selectionState", newSelectionState);
      newContentState = Modifier.insertText(newContentState, newSelectionState, '|', {fontSize: '20px', color: 'blue'});
      console.log("even newer contentState", newContentState);
      this.setState({editorState: newContentState});

    });
  }

  componentDidMount() {
    this.domEditor.focus();
    if (this.props.docId) {
      this.setState({docId: this.props.docId});
      this.getDoc();
    }
  }


  getDoc() {
    axios.get('http://localhost:3000/doc/' + this.props.docId)
    .then(resp => {
      const parsed = JSON.parse(resp.data.doc.contents);
      const newEditorState = convertFromRaw(parsed);
      console.log('convertFromRaw', newEditorState);
      this.setState({
        title: resp.data.doc.title,
        editorState: EditorState.createWithContent(newEditorState),
      });
    })
    .catch(err => {
      console.log('Error getting docs:', err);
    });
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
        contents: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
        title: this.state.title,
      })
      .then(resp => {
        console.log('convertToRaw', convertToRaw(this.state.editorState.getCurrentContent()));
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  saveModal() {
    axios.post('http://localhost:3000/doc/new', {
      password: this.state.password,
      title: this.state.title,
      contents: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
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

  addCollab() {
    axios.post('http://localhost:3000/' + 'addCollab', {
      docId: this.state.docId,
      newCollab: this.state.newCollab,
    })
    .then(resp => {
      console.log('addCollab request sent', resp.data);
      if (resp.data.addedCollab) {
        $('#collabModal').modal('close');
      }
    })
    .catch(resp => {
      console.log(resp);
    });
  }


  render() {
    let className = 'RichEditor-editor';
    const {editorState} = this.state;
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    //need to send anchorKey and start and end;
    console.log("anchorKey", anchorKey);
    console.log('currentContent', currentContent);
    console.log("currentContentBlock", currentContentBlock);
    console.log("start", start);
    console.log("end", end);
    console.log("selectedText", selectedText);
    return (

      <div className="wrapper" style={{width: '95%'}}>

			<Modal id='collabModal'
				header='Add collaborators'
        actions={<Button onClick={this.addCollab} waves='light' className="save-doc">invite<Icon left>group_add</Icon></Button>}
      >
				<Input onChange={this.handleInputChange} value={this.state.newCollab} name="newCollab" type="text" label="username" s={12} />
			</Modal>

      <Row className="title-row">
        <Input className="title-input" s={6} name="title" label={this.state.title ? null : "Title"} value={this.state.title} onChange={this.handleInputChange}/>
        <Button onClick={() => $('#collabModal').modal('open')} waves='light' className="save-doc">invite<Icon left>group_add</Icon></Button>
      </Row>
      <div className="RichEditor-root">
          <div className="toolbar-wrapper">
            <BlockStyleControls
              editorState={editorState}
              onToggle={this._toggleBlockStyle}
            />
            <InlineStyleControls
              editorState={editorState}
              onToggle={this._toggleInlineStyle}
            />
          </div>
          <div className={className} onClick={this.focus}>
            <Editor blockStyleFn={getBlockStyle} spellCheck={true} customStyleMap={styleMap} ref={this.setDomEditorRef} editorState={this.state.editorState} onChange={this.onChange} />
          </div>
      </div>

			<Modal id='saveModal'
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
