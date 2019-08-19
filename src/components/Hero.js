import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Button from './Button';
import ALink from './ALink';
import { FaTwitterSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from 'react-icons/fa';

const HeroStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 99px 0;
  color: #fff;
  background-image: radial-gradient(#53AAD9, rgb(12, 126, 175));
  height: calc(100vh - 72px);
`

const Avatar = styled(Image)`
  border: 8px solid #0c7eaf;
  border-radius: 50%;
  flex-shrink: 0;
  transform: rotate(${props => props.rotate}deg);
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
  margin: 27px 0;
  text-align: center;
  font-size: 20px;
  width: 50%;

  @media (max-width: 599px) {
    width: 90%;
  }
`

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 16px;
`

const query = graphql`
  query HeroQuery {
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
`

const Hero = () => {
  const data = useStaticQuery(query)
  const [theta, setTheta] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const offset = 50;

    if (scrollTop > offset) {
      setTheta((scrollTop - offset) / .8);
    } else {
      setTheta(0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // runs once

  const {
    title,
    author,
    description,
    social,
  } = data.site.siteMetadata
  const { publicURL } = data.allFile.edges[0].node

  return (
    <HeroStyle>
      <Avatar
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        rotate={theta}
      />
      <Title>{title}</Title>
      <form method="get" action={publicURL}>
        <Button>Download Resume</Button>
      </form>
      <Subtitle>{description}</Subtitle>
      <Links>
        <ALink href={social.github.url} target="_blank">
          <FaGithub size={42} />
          {/* <span>{social.github.title}</span> */}
        </ALink>
        <ALink href={social.linkedin.url} target="_blank">
          <FaLinkedinIn size={42} />
          {/* <span>{social.linkedin.title}</span> */}
        </ALink>
        <ALink href={social.twitter.url} target="_blank">
          <FaTwitterSquare size={42} />
          {/* <span>{social.twitter.title}</span> */}
        </ALink>
      </Links>
    </HeroStyle>
  )
};

export default Hero;
