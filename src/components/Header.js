import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Button from './Button';

const HeaderStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 99px 0;
  color: #fff;
  background-color: #0c7eaf;
  height: 100vh;
`
const Avatar = styled(Image)`
  border: 8px solid #009edc;
  border-radius: 50%;
  flex-shrink: 0;
`;

const Title = styled.div`
  margin: 27px 10px;
  font-size: 50px;
  text-transform: uppercase;
`;

const Subtitle = styled.div`
  margin: 27px 10px;
  text-align: center;
  font-size: 20px;
  max-width: 599px;
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
            twitter
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
    </HeaderStyle>
  )
};

export default Header;
