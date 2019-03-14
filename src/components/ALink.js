import styled from 'styled-components'

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
export default ALink;