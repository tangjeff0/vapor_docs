import React from 'react';
import {Dropdown, Icon} from 'react-materialize';
const FONT_SIZES = [
  {label: 'Small', style: 'SMALL'},
  {label:'Normal', style: 'NORMAL'},
  {label:'Large', style: 'LARGE'}
];

class FontSizeDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSize: 'Normal'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, style, label) {
    e.preventDefault();
    this.props.onToggle(style);
    this.setState({selectedSize: label});
  }

  render() {
    return (
      <Dropdown trigger={
  <div onMouseDown={(e) => e.preventDefault()} style={{display: 'inline-block', marginLeft: '15px', marginTop: '7px', position: 'absolute'}}>{this.state.selectedSize}<Icon right className="dropdown-icon">arrow_drop_down</Icon></div>
  }>
      {FONT_SIZES.map(style => {
        if(style.label ==='Small') {
          return <div key={style.label} style={{marginTop:'5px',color: 'grey'}} onMouseDown={(e) => this.handleClick(e, style.style, style.label )} key={style.label} style={{fontSize: '10px'}}><span style={{fontSize: '10px'}}>{style.label}</span></div>;
        }
        if(style.label ==='Large') {
          return <div key={style.label} style={{marginTop:'5px',color: 'grey'}} onMouseDown={(e) => this.handleClick(e, style.style, style.label )} key={style.label} style={{fontSize: '20px'}}><span style={{fontSize: '20px'}}>{style.label}</span></div>;
        }
        return <div key={style.label} style={{marginTop:'5px',color: 'grey'}} onMouseDown={(e) => this.handleClick(e, style.style, style.label )} key={style.label} style={{fontSize: '15px'}}><span style={{fontSize: '15px'}}>{style.label}</span></div>;
      }
      )}
      </Dropdown>
    );
  }
}

export default FontSizeDropDown;
