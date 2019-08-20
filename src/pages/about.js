import React from 'react';
import Header from "../components/Header"
import Hero from '../components/Hero';
import Features from '../components/Features';
import Projects from '../components/Projects'
// import Footer from "../components/Footer"
import SEO from '../components/Seo';

class BlogIndex extends React.Component {
  render() {
    return (
      <>
        <Header />
        <SEO
          title="John Betancur"
          keywords={['john betancur', `blog`, `developer`, `javascript`, `react`, `resume`, 'redux', 'styled-components', 'node.js', 'reactjs']}
        />
        {/* <Navigation /> */}
        <Hero />
        <Projects />
        <Features />
        {/* <Footer /> */}
      </>
    )
  }
}

export default BlogIndex
