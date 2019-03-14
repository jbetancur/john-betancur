import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import ALink from './ALink';
import Button from './Button';

const Projects = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 99px 0 99px 0;
  color: #fff;
  background-color: #009edc; 
`

const Project = styled.div`
  height: 250px;
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
          }
        }
      }
    }
  `)

  const { markdownRemark } = data
  const { frontmatter } = markdownRemark

  return (
    <Projects>
      {frontmatter.projects.map(project => (
        <Project key={project.title}>
          <ProjectName href={project.url} target="_blank">
            {project.title}
          </ProjectName>
          <ProjectDescription>{project.description}</ProjectDescription>
          <Button tag="a" href={project.demo} target="_blank">Live Demo</Button>
        </Project>
      ))}
    </Projects>
  )
};

export default ProjectSection;
