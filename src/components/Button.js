import React from "react"
import styled from "styled-components"

const Button = styled.button`
  display: inline-block;
  padding: 0 16px 0 16px;
  text-align: center;
  font-size: 18px;
  line-height: 45px;
  color: #0c7eaf;
  background-color: #fff;
  border-radius: 3px;
  border: 1px solid #fff;
  text-decoration: none;
  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: 0.1s ease-in;
  outline: none;

  &:hover {
    box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.4);
  }
`

export default Button;
