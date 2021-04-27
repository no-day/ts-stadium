import * as React from 'react';
import * as SM from '@no-day/ts-stadium';

import { stateMachine } from './state-machine';
import { Render } from './render';

export const Toggle = () => {
  const [state, setState] = React.useState(
    SM.init(stateMachine, SM.tag('Off'))
  );

  return <Render state={state} onEvent={() => {}} />;
};
