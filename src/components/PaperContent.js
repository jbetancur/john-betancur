import React from 'react';
import styled from 'styled-components';

const Content = styled.div`
  padding: 0 32px 8px 32px;
`;

const Paper = ({ children }) => {
  return (
    <Content>
      {children}
    </Content>
  );
}

export default Paper;
