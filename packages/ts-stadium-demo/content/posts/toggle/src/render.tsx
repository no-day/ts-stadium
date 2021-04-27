import * as SM from '@no-day/ts-stadium';
import React, { ReactElement } from 'react';

import IconOff from './assets/switch-off.svg';
import IconOn from './assets/switch-on.svg';
import { stateMachine } from './state-machine';

export const Render = SM.createCbRender(stateMachine)<ReactElement>({
  On: () => (onEvent) => (
    <span
      style={{ width: '100px', cursor: 'pointer' }}
      onClick={() => onEvent(SM.tag('SwitchOff'))}
      title="Click to switch OFF"
    >
      <IconOn />
    </span>
  ),
  Off: () => (onEvent) => (
    <span
      style={{ width: '100px', cursor: 'pointer' }}
      onClick={() => onEvent(SM.tag('SwitchOn'))}
      title="Click to switch ON"
    >
      <IconOff />
    </span>
  ),
});
