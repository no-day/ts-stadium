import * as React from 'react';
import styled from '@emotion/styled';

const Root = styled.div`
  display: flex;
  width: 100%;
  background-color: rgb(40, 42, 54);

  flex-direction: column;
  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

const PanelLeft = styled.div`
  //border: 1px solid grey;
  flex: 1 1 0px;
  display: grid;
  justify-items: center;
  align-items: center;
`;

const PanelRight = styled.div`
  flex: 1 1 0px;
  display: grid;
  //justify-items: center;
  align-items: center;
  padding: 20px;
`;

export const Split = ({
  children: [left, right],
}: {
  children: [any, any];
}) => (
  <Root>
    <PanelLeft>{left}</PanelLeft>
    <PanelRight>{right}</PanelRight>
  </Root>
);
