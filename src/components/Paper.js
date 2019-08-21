import React from 'react';
import styled from 'styled-components';

const OuterCard = styled.div`
  background-color: white;
  margin-top: 24px;
  margin-bottom: 24px;
  border-radius: 10px;
  box-shadow: 0 4px 2px -2px rgba(0,0,0,0.01);
`;

const Paper = ({ children }) => {
  return (
    <OuterCard>
      {children}
    </OuterCard>
  );
}

export default Paper;
