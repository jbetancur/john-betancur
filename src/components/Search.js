import React from 'react';
import styled from 'styled-components';
import ClearIcon from './ClearIcon';

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  vertical-align: middle;
`;

const Clear = styled.button`
  margin-left: -42px;
  vertical-align: middle;
  padding: 10px;
  height: 38px;
  width: 38px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: transparent;
  transition: background-color 225ms ease;

  &:hover {
    background-color: #E5E5E5;
  }
`;

const Search = ({ onClick, ...rest }) => (
  <>
    <Input {...rest } />
    <Clear onClick={onClick}><ClearIcon /></Clear>
  </>
)

export default Search
