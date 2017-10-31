import React from 'react';
import {Icon} from 'react-materialize';

class StyleButton extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
    this.returnLabelButton = this.returnLabelButton.bind(this);
  }

  returnLabelButton() {
    switch (this.props.label) {
    case 'Bold':
      return (
        <Icon>format_bold</Icon>
      );
    case 'Italic':
      return (
        <Icon>format_italic</Icon>
      );
    case 'Underline':
      return (
        <Icon>format_underline</Icon>
      );
    case 'Left-Align':
      return (
        <Icon>format_align_left</Icon>
      );
    case 'Right-Align':
      return (
        <Icon>format_align_right</Icon>
      );
    case 'Center-Align':
      return (
        <Icon>format_align_center</Icon>
      );
    case 'OL':
      return (
        <Icon>format_list_numbered</Icon>
      );
    case 'UL':
      return (
        <Icon>format_list_bulleted</Icon>
      );
    default:
      return this.props.label;
    }
  }
  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span style={{marginTop: '3px'}} className={className} onMouseDown={this.onToggle}>
        {this.returnLabelButton()}
      </span>
    );
  }
}

export default StyleButton;
