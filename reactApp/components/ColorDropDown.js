import React from 'react';
import {Dropdown, Icon} from 'react-materialize';

const COLOR_STYLES = [
  {label: 'Red', style: 'RED'},
  {label:'Blue', style: 'BLUE'},
  {label:'Green', style: 'GREEN'}
];

const DropDownItem = (props) => {
  if(props.active) {
    return (
      <div style={{marginTop:'5px',color: 'grey'}} onMouseDown={(e) => props.handleClick(e, props.style,props.label )} key={props.label} style={{color: props.label}}><span style={{color: props.label}}>{props.label}</span> </div>
    );
  }
  return (
    <div style={{marginTop:'5px', color: 'grey'}} onMouseDown={(e) => props.handleClick(e, props.style, props.label)} key={props.label}><span>{props.label}</span> </div>
  );
};
class ColorDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      selectedColor: ''
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, style, label) {
    e.preventDefault();
    this.props.onToggle(style);
    this.setState({selectedColor: label});
  }

  render() {
    return (
      <Dropdown trigger={
	<div onMouseDown={(e) => e.preventDefault()} style={{display: 'inline-block'}}>{this.state.selectedColor ? this.state.selectedColor : 'Color'}<Icon right className="dropdown-icon">arrow_drop_down</Icon></div>
	}>
      {COLOR_STYLES.map(style => {
        return <DropDownItem key={style.label} active={this.state.selectedColor === style.label} handleClick={this.handleClick} label={style.label} style={style.style} />;
      })}
      </Dropdown>
    );
  }
}

export default ColorDropDown;
