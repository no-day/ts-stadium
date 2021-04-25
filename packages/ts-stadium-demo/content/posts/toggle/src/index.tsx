import * as SM from '@no-day/ts-stadium';
import * as React from 'react';
import { stateMachine } from './state-machine';
import { Render } from './render';
import { control } from './control';

export const Toggle = () => {
  const [state, setState] = React.useState(
    SM.init(stateMachine, SM.tag('Off'))
  );

  return <Render state={state} onEvent={() => {}} />;
};
