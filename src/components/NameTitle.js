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
  color: #FFFFFF;
  line-height: 1;
`

const Avatar = styled.div`
  display: flex;
  align-items: center;
`

const AvatarImage = styled(Image)`
  margin-right: ${rhythm(1 / 2)};
  margin-bottom: 0;
  border-radius: 100%;
  border: 2px solid white;
`

const NameTitle = ({ hideAvatarImage }) => {
  return (
    <StaticQuery
      query={nameTitleQuery}
      render={data => {
        const { author } = data.site.siteMetadata;

        return (
          <Avatar>
            {!hideAvatarImage && (
              <AvatarImage
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  minWidth: 48,
                }}
                imgStyle={{
                  borderRadius: `50%`,
                }}
              />
            )}
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
  query NameTitleQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 48, height: 48) {
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
