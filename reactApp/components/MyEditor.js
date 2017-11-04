import React from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import {Button, Icon, Row, Input, Modal, SideNav, SideNavItem, Collection, CollectionItem} from 'react-materialize';
import axios from 'axios';
import InlineStyleControls from './InlineStyleControls';
import BlockStyleControls from './BlockStyleControls';
import _ from 'underscore';
const styleMap = {
  RED :{
    color: 'red'
  },
  BLUE: {
    color: 'blue'
  },
  BLACK: {
    color: 'black'
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
function searchNodes(node, searchTerm, nodeArray) {
  if(node.hasChildNodes()) {
    var children = node.childNodes;
    for(var i =0; i < children.length; i++) {
      searchNodes(children[i], searchTerm, nodeArray);
    }
  } else {
    if(node.textContent.indexOf(searchTerm) > -1){
      //find character width;
      const characterWidth = Math.abs(node.parentNode.getBoundingClientRect().left - node.parentNode.getBoundingClientRect().right )/node.textContent.length;
      console.log("characterWidth", characterWidth);
      nodeArray.push({node, index: node.textContent.indexOf(searchTerm), position: node.parentNode.getBoundingClientRect(), characterWidth, searchTerm: searchTerm.length});
    }

  }
}
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      docId: '',
      password: '',
      title: '',
      newCollab: '',
      collabObj: {},
      searchTerm:'',
      revisions: [],
      searchArray: [],
    };
    console.log("socket", this.props.socket);
    this.onChange = (editorState) => {
      this.setState({editorState});
      let data;
      //only emit a cursor event if it took place in the editor (dont emit an event where user has clicked somewhere out of the screen)
      const windowSelection = window.getSelection();
      if(windowSelection.rangeCount>0){
        // console.log('window selection rangecount >0');
        const range = windowSelection.getRangeAt(0);
        const clientRects = range.getClientRects();
        if(clientRects.length > 0) {
          // console.log('client rects >0');
          const rects = clientRects[0];//cursor wil always be a single range so u can just ge tthe first range in the array
          const loc = {top: rects.top, left: rects.left, right: rects.right};
          data = {loc};

          // console.log('about to emit cursor movement ');
          //
          // this.setState({editorState: originalEditorState, top, left, height: bottom - top})
        }
        // this.socket.emit('cursorMove', selection)
      }


      this.props.socket.emit('change doc', {
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        room: this.state.docId,
        socketId: this.props.socket.id,
        data
      });
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
      /* console.log("CONTENTS", contents); */
      // console.log("contents", contents);


      const newUserObj = Object.assign({}, this.state.collabObj);
      newUserObj[contents.socketId] = contents.userObj[contents.socketId];
      this.setState({collabObj: newUserObj});
      // console.log("contents.userObj", contents.userObj);
      // this.setState({top: contents.data.loc.top, left: contents.data.loc.left});
      let newEditorState = EditorState.createWithContent(convertFromRaw(JSON.parse(contents.content)));
      this.setState({editorState: EditorState.forceSelection(newEditorState, this.state.editorState.getSelection())});

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
        revisions: resp.data.doc.revision_history,
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
    if(name==="searchTerm") {
      //Get element node Text
      const editor = document.getElementsByClassName('public-DraftEditor-content')[0];
      const node = editor;
      const nodeArray = [];
      searchNodes(node, value, nodeArray);
      this.setState({searchArray: nodeArray});
    }
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
        this.setState({revisions: resp.data.doc.revision_history});
        /* console.log('convertToRaw', convertToRaw(this.state.editorState.getCurrentContent())); */
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
      this.setState({docId: resp.data.doc._id, revisions: resp.data.doc.revision_history});
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
      if (resp.data.addedCollab) { $('#collabModal').modal('close'); }
    })
    .catch(resp => { console.log(resp); });
  }


  render() {
    let className = 'RichEditor-editor';
    const {editorState} = this.state;

    /* console.log('draftjsObj', draftjsObj); */
    return (
      <div className="wrapper" style={{width: '95%'}}>
			<Modal
        id='collabModal'
				header='Add Friends'
        actions={<Button onClick={this.addCollab} waves='light' className="save-doc">i n v i t e<Icon left>group_add</Icon></Button>}
      >
				<Input onChange={this.handleInputChange} value={this.state.newCollab} name="newCollab" type="text" label="u s e r n a m e" s={12} />
			</Modal>
			<Modal
        id='saveModal'
				header='p r o t e c t y o u r d o c'
        actions={<Button onClick={this.saveModal} waves='light' className="save-doc">s a v e<Icon left>save</Icon></Button>}
      >
				<Input onChange={this.handleInputChange} value={this.state.password} name="password" type="password" label="p a s s w o r d" s={12} />
			</Modal>

      <Row className="title-row">
        <Input className="title-input" s={6} name="title" label={this.state.title ? null : "Title"} value={this.state.title} onChange={this.handleInputChange}/>
        <Button onClick={() => $('#collabModal').modal('open')} waves='light' className="save-doc">i n v i t e<Icon left>group_add</Icon></Button>
        <Input name="searchTerm" onChange={this.handleInputChange} value={this.state.searchTerm} label="s e a r c h" validate><Icon>search</Icon></Input>
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

        <div
          className={className}
          onClick={this.focus}
        >
          {_.map(this.state.collabObj, (val, key) => {
            /* console.log("val", val); */
            if(val) {
              if(val.hasOwnProperty('top')) {
                if(val.left !== val.right) {
                  return(
                    <div key={val.color} style={{position: 'absolute', opacity: 0.2, zIndex: 0, backgroundColor: val.color, width: Math.abs(val.left - val.right) + 'px', height: '15px', top: val.top, left: val.left}}></div>
                  );
                }
                return (
                  <div key={val.color} style={{position: 'absolute', backgroundColor: val.color, width: '2px', height: '15px', top: val.top, left: val.left}}></div>
                );
              } else{
                return <div key={key}></div>;
              }
            }
            return <div key={key}></div>;
          })}
          {this.state.searchArray.map(searchObj => {
            const leftIndex = searchObj.position.left + (searchObj.index*searchObj.characterWidth);
            const width = searchObj.searchTerm *searchObj.characterWidth;
            return (
              <div key={searchObj.top} style={{position: 'absolute', backgroundColor: 'blue', opacity: 0.2, width: width + 'px', height: '15px', top: searchObj.position.top, left: leftIndex + 'px'}}></div>
            );
          })}
          <Editor
            blockStyleFn={getBlockStyle}
            spellCheck={true}
            customStyleMap={styleMap}
            ref={this.setDomEditorRef}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>

      </div>

      <Row className='bottom-row'>

        <VapeOutline currentContent={this.state.editorState.getCurrentContent()} />
        <Modal
          header='R E V I S I O N S'
          fixedFooter
          trigger={<Button className='bottom-buttons'><Icon left>archive</Icon>r e v i s i o n s</Button>}
        >
          <Collection>
            {this.state.revisions.map((rev,idx) => {
              const dateInstance = new Date(rev.timestamp);
              const dateStr = dateInstance.toString().slice(0, 24);
              return (
                <CollectionItem key={idx} className='revision-container'>
                <a style={{color: '#2bbbad', fontStyle: 'italic'}} onClick={() =>  this.setState({editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(rev.contents)))}) }>
                  // {dateStr}
                </a>
                </CollectionItem>
              );
            })}
          </Collection>
        </Modal>
        <Button onClick={this.saveDoc} waves='light' className="bottom-buttons">s a v e<Icon left>save</Icon></Button>

      </Row>

      </div>
    );
  }
}

const VapeOutline = (props) => {
  const blocks = props.currentContent.getBlockMap()._list._tail.array;
  let headers = [];
  blocks.forEach(block => {
    const vNode = block[1].getInlineStyleAt(0)._map._list._tail;
    if (vNode) {
      let ctr = 0;
      vNode.array.forEach(style => {
        if (style) {
          if (style[0] === 'LARGE' || style[0] === 'BOLD') {
            ctr++;
            if (ctr === 2) { headers = [...headers, block[1].getText()]; }
          }
        }
      });
    }
  });
  return (
    <SideNav
    trigger={<Button className='bottom-buttons'><Icon left>sort</Icon>o u t l i n e</Button>}
      options={{ closeOnClick: true }}
    >
      <h4 style={{marginLeft: '20px', color: '#1976d2', fontStyle: 'italic'}}>O U T L I N E</h4>
      {headers.map((header, idx) => {
        return <SideNavItem key={header + idx}><h5 style={{fontStyle: 'italic'}}className='blue-text text-lighten-2' >{idx + 1}// {header}</h5></SideNavItem>
      })}
    </SideNav>
  );

};

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
