import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from "gatsby"

const Features = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 99px 0 99px 0;
  color: #fff;
  background-color: #333; 
`;

const Feature = styled.div`
  height: 290px;
  width: 290px;
  margin: 10px 10px 10px 10px;
  text-align: center;
`;

const FeatureName = styled.div`
  font-size: 30px;
  font-weight: 400;
  line-height: 45px;
`;

// const FeatureDescription = styled.div`
//   margin: 9px 18px 0;
//   font-size: 20px;
//   max-width: 100%;
// `;

// const FeatureFooter = styled.footer`
//   margin: 72px 10px 0;
//   font-size: 20px;
//   text-align: center;
// `;

const Img = styled.img`
  height: 164px;
  width: 164px;
  flex-shrink: 0;
`

const FeatureSection = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fileAbsolutePath: { regex: "/(features)/.*.md$/" }) {
        frontmatter {
          features {
            title
            description
            image {
              publicURL
            }
          }
        }
      }
    }
  `)

  const { markdownRemark } = data
  const { frontmatter } = markdownRemark

  return (
    <Features>
      {frontmatter.features.map(feature => (
        <Feature key={feature.title}>
          <Img src={feature.image.publicURL} alt={feature.title} />
          <FeatureName>{feature.title}</FeatureName>
          {/* <FeatureDescription>{feature.description}</FeatureDescription> */}
        </Feature>
      ))}
      {/* <FeatureFooter>check me out at g</FeatureFooter> */}
    </Features>
  )
};

export default FeatureSection;
