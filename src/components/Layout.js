import React from 'react';
import Header from './Header';

import { rhythm } from "../utils/typography"

class Layout extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <>
        <Header />
        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(32),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <main>{children}</main>
          {/* <footer>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer> */}
        </div>
      </>
    )
  }
}

export default Layout
