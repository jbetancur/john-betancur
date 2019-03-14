import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-block;
  cursor: pointer;

  @media screen and (min-width: 599px) {
    display: none;
  }
`;

const Ingredient = styled.div`
  box-sizing: border-box;
  width: 30px;
  height: 3px;
  background-color: white;
  margin: 6px 0;
  transition: all 0.1s ease-out;
`;

const TopBun = styled(Ingredient)`
  ${props => props.toggled && 'transform: rotate(-45deg) translate(-7px, 7px)'};
`;

const TheBeef = styled(Ingredient)`
  ${props => props.toggled && "opacity: 0"};
  transition: 0.05s;
`;

const BottomBun = styled(Ingredient)`
  ${props => props.toggled && 'transform: rotate(45deg) translate(-6px, -6px)'};
`;

const Hamburger = ({ onToggled }) => {
  const [toggled, setToggled] = useState(false)
  const handleToggle = () => {
    setToggled(!toggled)
    onToggled(!toggled)
  }

  return (
    <Container role="button" onClick={handleToggle}>
      <TopBun toggled={toggled} />
      <TheBeef toggled={toggled} />
      <BottomBun toggled={toggled} />
    </Container>
  );
};

Hamburger.propTypes = {
  onToggled: PropTypes.func,
};

Hamburger.defaultProps = {
  onToggled: () => {},
};

export default Hamburger;
