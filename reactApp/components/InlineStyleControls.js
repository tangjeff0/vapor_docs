import React from 'react';
import StyleButton from './StyleButton';
import ColorDropDown from './ColorDropDown';
import FontSizeDropDown from './FontSizeDropDown';
var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'}
];


const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => {
        return (
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        );
      }
      )}
      <ColorDropDown onToggle={props.onToggle}/>
      <FontSizeDropDown onToggle={props.onToggle} />
    </div>
  );
};

export default InlineStyleControls;
