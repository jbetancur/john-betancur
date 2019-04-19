import React from 'react';
// import Navigation from '../components/Navigation';
import Header from '../components/Header';
import Features from '../components/Features';
import Projects from '../components/Projects'
// import Footer from "../components/Footer"
import SEO from '../components/seo';

class BlogIndex extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SEO
          title="John Betancur"
          keywords={['john betancur', `blog`, `developer`, `javascript`, `react`, `resume`, 'redux', 'styled-components', 'node.js', 'reactjs']}
        />
        {/* <Navigation /> */}
        <Header />
        <Projects />
        <Features />
        {/* <Footer /> */}
      </React.Fragment>
    )
  }
}

export default BlogIndex
