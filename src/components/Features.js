import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import SectionTitle from './SectionTitle';

const Section = styled.div`
  padding: 0 0 99px 0;
  height: 100%;
  color: #fff;
  background-color: #333;
  text-align: center;
`;

const Features = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const Feature = styled.div`
  height: 200px;
  width: 200px;
  margin: 20px;
  text-align: center;
`;

const FeatureName = styled.div`
  font-size: 22px;
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
  height: 96px;
  width: 96px;
  flex-shrink: 0;
`

const FeatureSection = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fileAbsolutePath: { regex: "/(features)/.*.md$/" }) {
        frontmatter {
          title
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
    <Section>
      <SectionTitle>
        {frontmatter.title}
      </SectionTitle>
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
    </Section>
  )
};

export default FeatureSection;
