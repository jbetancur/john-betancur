import React from "react"
import { Link, graphql } from "gatsby"
import Image from 'gatsby-image'
import Layout from "../components/Layout"
import SEO from "../components/Seo"
import Paper from '../components/Paper'
import PaperContent from '../components/PaperContent'
import { rhythm } from "../utils/typography"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug

          return (
            <Paper key={node.fields.slug}>
              {node.frontmatter.image && (
                <Image
                  fluid={node.frontmatter.image.childImageSharp.fluid}
                  alt={node.frontmatter.title}
                  fadeIn
                  style={{
                    marginBottom: rhythm(1 / 2),
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                  }}
                />
              )}

              <PaperContent>
                <h2
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
                </h2>
                <small><span role="img" aria-label="date">🕒</span>{node.frontmatter.date} &nbsp; {node.fields.readingTime.text}</small>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />

                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  <p>Read More...</p>
                </Link>
              </PaperContent>
            </Paper>
          );
        })}
      </Layout>
    )
  }
}

export default BlogIndex;

export const pageQuery = graphql`
         query {
           site {
             siteMetadata {
               title
             }
           }
           allMarkdownRemark(
             sort: { fields: [frontmatter___date], order: DESC }
             filter: {
                fileAbsolutePath: {glob: "**/blog/**"}
                frontmatter: { published: { eq: true } }
              }
           ) {
             edges {
               node {
                 excerpt
                 fields {
                   slug
                   readingTime {
                    text
                   }
                 }
                 frontmatter {
                   date(formatString: "MMMM DD, YYYY")
                   title
                   description
                   image {
                    childImageSharp {
                      fluid {
                        ...GatsbyImageSharpFluid
                      }
                    }
                   }
                 }
               }
             }
           }
         }
       `
