import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';

const FooterStyle = styled.footer`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 99px 0;
  color: #fff;
  background-color: #333;
`

const Footer = () => {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      site {
        siteMetadata {
          title
          author
          description
          footnote
          social {
            twitter
          }
        }
      }
    }
  `)

  const { footnote } = data.site.siteMetadata

  return <FooterStyle>{footnote}</FooterStyle>
};

export default Footer;
