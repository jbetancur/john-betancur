import React from 'react';
import styled from 'styled-components';

const OuterCard = styled.div`
  background-color: white;
  margin-top: 24px;
  margin-bottom: 24px;
  border-radius: 10px;
  padding: 32px;
`;

const Paper = ({ children }) => {
  return (
    <OuterCard>
      {children}
    </OuterCard>
  );
}

export default Paper;
