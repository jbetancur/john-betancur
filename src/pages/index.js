import React from 'react';
// import Navigation from '../components/Navigation';
import Header from '../components/Header';
import Features from '../components/Features';
// import Footer from "../components/Footer"
import SEO from '../components/seo';

class BlogIndex extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SEO
          title="John Betancur"
          keywords={[`blog`, `developer`, `javascript`, `react`, `resume`]}
        />
        {/* <Navigation /> */}
        <Header />
        <Features />
        {/* <Footer /> */}
      </React.Fragment>
    )
  }
}

export default BlogIndex
