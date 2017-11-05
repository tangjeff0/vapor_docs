import React from 'react';
import {SideNav, SideNavItem, Button, Icon} from 'react-materialize';

const Outline = (props) => {
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
      {headers.map((header, idx) => (
        <SideNavItem key={header + idx}>
          <h5 style={{fontStyle: 'italic'}}className='blue-text text-lighten-2'>
            {idx + 1}/ {header}
          </h5>
        </SideNavItem>
      ))}
    </SideNav>
  );
};

export default Outline;
