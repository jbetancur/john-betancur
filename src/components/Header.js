import React from 'react'
import styled from 'styled-components'
import { Link, Location } from '@reach/router'
import NameTitle from './NameTitle'
import NavLink from './NavLink'

const HeaderStyle = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 16px;
  width: 100%;
  height: 72px;
  background-color: #53AAD9;
  ${props => props.shadow && 'box-shadow: 0 4px 2px -2px rgba(0,0,0,0.2)'};
  z-index: 1;

  @media only screen and (max-width: 600px) {
    height: 64px;
    padding: 0 8px 0 8px;
  }
`

const NameTitleLink = styled(Link)`
  text-decoration: none;
  border: none;
  box-shadow: none;
`

const Header = () => (
  <Location>
    {({ location }) => {
      const isAboutPage = location.pathname === '/about' || location.pathname === '/about/'

      return (
        <HeaderStyle shadow={!isAboutPage}>
          <NameTitleLink to="/">
            <NameTitle hideAvatarImage={isAboutPage} />
          </NameTitleLink>
          <div>
            <NavLink to="/">Blog</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
        </HeaderStyle>
      );
    }}
  </Location>
)

export default Header
