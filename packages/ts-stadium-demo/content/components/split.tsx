import * as React from 'react';
import styled from '@emotion/styled';

const Root = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const Panel = styled.div`
  border: 1px solid black;
  flex: 1 1 0px;
  display: grid;
  //justify-items: center;
  align-items: center;
`;

export const Split = ({
  children: [left, right],
}: {
  children: [any, any];
}) => (
  <Root>
    <Panel>{left}</Panel>
    <Panel>{right}</Panel>
  </Root>
);
