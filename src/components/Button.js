import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const e = React.createElement;

const Button = styled(({ tag, children, ...props }) => e(tag, props, children))`
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
  transition: all 0.2s ease-in;
  outline: none;

  &:hover {
    box-shadow: 3px 6px 6px 0 rgba(0, 0, 0, 0.4);
  }
`

Button.propTypes = {
  tag: PropTypes.string,
}

Button.defaultProps = {
  tag: 'button',
};

export default Button;
