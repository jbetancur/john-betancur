import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import ALink from './ALink';
import Button from './Button';
import SectionTitle from './SectionTitle';

const Section = styled.div`
  padding: 0 0 99px 0;
  height: 100%;
  color: #fff;
  background-color: #009edc; 
  text-align: center;
`;

const Projects = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const Project = styled.div`
  width: 250px;
  margin: 10px 10px 10px 10px;
  text-align: center;
`

const ProjectName = styled(ALink)`
  font-size: 30px;
  font-weight: 400;
  line-height: 45px;
`

const ProjectDescription = styled.div`
  margin: 9px 18px 9px;
  font-size: 20px;
  max-width: 100%;
`

const Img = styled.img`
  height: 164px;
  width: 164px;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
`

const ProjectSection = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fileAbsolutePath: { regex: "/(projects)/.*.md$/" }) {
        frontmatter {
          projects {
            title
            description
            url
            demo
            demoTitle
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
          Projects
        </SectionTitle>
      <Projects>
        {frontmatter.projects.map(project => (
          <Project key={project.title}>
            {project.image && <Img src={project.image.publicURL} alt={project.title} />}
            <ProjectName href={project.url} target="_blank">
              {project.title}
            </ProjectName>
            <ProjectDescription>{project.description}</ProjectDescription>
            {project.demo && <Button tag="a" href={project.demo} target="_blank">{project.demoTitle}</Button>}
          </Project>
        ))}
      </Projects>
    </Section>
  )
};

export default ProjectSection;
