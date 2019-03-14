import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Button from './Button';
import { FaTwitterSquare } from "react-icons/fa"
import { FaGithub } from "react-icons/fa"
import { FaLinkedinIn } from 'react-icons/fa'

const HeaderStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 99px 0;
  color: #fff;
  background-image: radial-gradient(rgb(0, 158, 220), rgb(12, 126, 175));
  height: 100vh;
`
const Avatar = styled(Image)`
  border: 8px solid #0c7eaf;
  border-radius: 50%;
  flex-shrink: 0;
`

const Title = styled.div`
  margin: 27px 10px;
  font-size: 50px;
  text-transform: uppercase;

  @media screen and (max-width: 600px) {
    font-size: 42px;
  }
`

const Subtitle = styled.div`
  margin: 27px 10px;
  text-align: center;
  font-size: 20px;
  max-width: 599px;
`

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 16px;
`

const ALink = styled.a`
  color: #fff;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  box-shadow: none;
  margin: 5px;
  flex: 1 0 10%;

  span {
    padding: 0 8px 0 8px;
  }

  &:hover {
    text-decoration: underline;
  }
`

const Header = () => {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      allFile(filter: { extension: { eq: "pdf" } }) {
        edges {
          node {
            publicURL
          }
        }
      }
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 196, height: 196) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          title
          author
          description
          social {
            twitter {
              url
              title
            }
            github {
              url
              title
            }
            linkedin {
              url
              title
            }
          }
        }
      }
    }
  `)
  
  const { title, author, description, social } = data.site.siteMetadata
  const { publicURL } = data.allFile.edges[0].node

  return (
    <HeaderStyle>
      <Avatar fixed={data.avatar.childImageSharp.fixed} alt={author} />
      <Title>{title}</Title>
      <form method="get" action={publicURL}>
        <Button>Download Resume</Button>
      </form>
      <Subtitle>{description}</Subtitle>
      <Links>
        <ALink href={social.github.url} target="_blank">
          <FaGithub size={24} />
          <span>{social.github.title}</span>
        </ALink>
        <ALink href={social.twitter.url} target="_blank">
          <FaTwitterSquare size={24} />
          <span>{social.twitter.title}</span>
        </ALink>
        <ALink href={social.linkedin.url} target="_blank">
          <FaLinkedinIn size={24} />
          <span>{social.linkedin.title}</span>
        </ALink>
      </Links>
    </HeaderStyle>
  )
};

export default Header;
