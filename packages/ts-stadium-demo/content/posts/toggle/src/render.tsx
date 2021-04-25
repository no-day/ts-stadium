import * as SM from '@no-day/ts-stadium';
import * as React from 'react';
import { ReactElement } from 'react';
import { stateMachine } from './state-machine';

export const Render = SM.createCbRender(stateMachine)<ReactElement>({
  On: () => (onEvent) => (
    <div onClick={() => onEvent(SM.tag('SwitchOff'))}>On</div>
  ),
  Off: () => (onEvent) => (
    <div onClick={() => onEvent(SM.tag('SwitchOn'))}>Off</div>
  ),
});
