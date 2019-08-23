import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import { rhythm } from '../utils/typography'

const Main = styled.main`
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(30)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
`;

const Layout = ({ children }) => (
  <>
  <Header />
    <Main>
      {children}
      {/* <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer> */}
    </Main>
  </>
  );

export default Layout
