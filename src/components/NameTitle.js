import React from "react"
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';

const Title = styled.span`
  padding: 0;
  margin: 0;
  font-weight: 500;
  font-size: 24px;
  line-height: 2;
  color: #FFFFFF;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarImage = styled(Image)`
  margin-right: ${rhythm(1 / 2)};
  margin-bottom: 0;
  border-radius: 100%;
  border: 2px solid white;
`;

function NameTitle() {
  return (
    <StaticQuery
      query={nameTitleQuery}
      render={data => {
        const { author } = data.site.siteMetadata;

        return (
          <Avatar>
            <AvatarImage
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <Title>
               {author}
            </Title>
          </Avatar>
        )
      }}
    />
  )
}

const nameTitleQuery = graphql`
  query NamtTitleQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 56, height: 56) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter {
            url
            title
          }
          github {
            url
            title
          }
        }
      }
    }
  }
`

export default NameTitle;
