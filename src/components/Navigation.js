import React, { useState } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
// import Hamburger from './Hamburger';

const NavigationStyle = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  padding: 0 16px 0 16px;
  /* background-color: #0c7eaf; */
  background-color: #333;
  clear: both;
  transition: height 0.2s ease-out;
  height: 48px;
  ${props => props.toggled && "height: 128px"};

  @media screen and (max-width: 600px) {}
`

const NavItem = styled(Link)`
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  outline: none;
  text-decoration: none;

  @media screen and (max-width: 600px) {}
`

const Navigation = () => {
  const [toggled, setToggled] = useState(false);
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          routes {
            title
            url
          }
        }
      }
    }
  `);

  const { routes } = data.site.siteMetadata

  return (
    <NavigationStyle toggled={toggled}>
      {routes.map(route => (
        <NavItem key={route.url} to={route.url}>
          {route.title}
        </NavItem>
      ))}
      {/* <Hamburger onToggled={value => setToggled(value)}/> */}
    </NavigationStyle>
  )
};

export default Navigation;
