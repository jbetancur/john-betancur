import React, { useState } from 'react'
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image'
import Layout from '../components/Layout'
import SEO from '../components/Seo'
import Paper from '../components/Paper'
import PaperContent from '../components/PaperContent'
import Search from '../components/Search'
import { rhythm } from '../utils/typography'

const BlogIndex = ({ data, location }) => {
  const [filter, setFilter] = useState('');
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges
  const postKeywords = posts.map(({ node }) => node.frontmatter.title);

  const handleFilter = ({ target }) => {
    setFilter(target.value.toLowerCase());
  }

  const filteredPosts = posts.filter(({ node }) =>
    node.frontmatter.title.toLowerCase().includes(filter) || node.excerpt.toLowerCase().includes(filter)
  );

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title="All posts"
        keywords={postKeywords}
      />

      <Search
        type="text"
        placeholder="Search Posts"
        value={filter}
        onChange={handleFilter}
        onClick={() => setFilter('')}
      />

      {filteredPosts.map(({ node }) => {
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
                  height: '350px',
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
              <small><span role="img" aria-label="date">🕒 &nbsp;</span>{node.frontmatter.date} &nbsp; {node.fields.readingTime.text}</small>
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

export default BlogIndex

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
            excerpt(pruneLength: 250, format: PLAIN)
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
              publicURL
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
