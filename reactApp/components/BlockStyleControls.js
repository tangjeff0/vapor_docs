import React from 'react';
import StyleButton from './StyleButton';
const BLOCK_TYPES = [
  {label: 'Left-Align', style: 'left'},
  {label: 'Center-Align', style: 'center'},
  {label: 'Right-Align', style: 'right'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'UL', style: 'unordered-list-item'}
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls" style={{display: 'inline'}}>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
export default BlockStyleControls;
