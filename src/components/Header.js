import React from 'react';
import styled from 'styled-components';
import { Link } from '@reach/router';
import NameTitle from "./NameTitle"
import NavLink from './NavLink';

const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 72px;
  background-color: #53AAD9;
  box-shadow: 0 4px 2px -2px rgba(0,0,0,0.2);
`;

const NameTitleLink = styled(Link)`
  text-decoration: none;
  border: none;
  box-shadow: none;
`;

const Header = () => {
  return(
    <HeaderStyle>
      <NameTitleLink to="/">
        <NameTitle />
      </NameTitleLink>
      <div>
        <NavLink to="/">Blog</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
    </HeaderStyle>
  );
};

export default Header;
