import React from 'react';
import styled from 'styled-components';
import { Link } from '@reach/router'

const LinkStyled = styled(Link)`
  margin: 5px;
  text-decoration: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 3px;
  // background-color: rgba(0,0,0,0.1);
`;

const NavLink = props => (
    <LinkStyled
      {...props}
      getProps={({ isCurrent }) => {
        // the object returned here is passed to the
        // anchor element's props
        return {
          style: {
            backgroundColor: isCurrent ? 'rgba(0,0,0,0.1)': 'transparent',
          }
        };
      }}
    />
  );

  export default NavLink;
