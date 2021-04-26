import * as SM from '@no-day/ts-stadium';
import React, { ReactElement } from 'react';

import IconOff from './assets/switch-off.svg';
import IconOn from './assets/switch-on.svg';
import { stateMachine } from './state-machine';

export const Render = SM.createCbRender(stateMachine)<ReactElement>({
  On: () => (onEvent) => (
    <div onClick={() => onEvent(SM.tag('SwitchOff'))}>
      <IconOn />
      On
    </div>
  ),
  Off: () => (onEvent) => (
    <div onClick={() => onEvent(SM.tag('SwitchOn'))}>
      <IconOff />
      Off
    </div>
  ),
});
