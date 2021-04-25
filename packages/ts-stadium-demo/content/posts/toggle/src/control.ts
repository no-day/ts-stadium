import * as SM from '@no-day/ts-stadium';
import * as React from 'react';
import { stateMachine } from './state-machine';
import * as T from 'fp-ts/Task';
import { URItoKind } from 'fp-ts/HKT';

export const control = SM.createControl(stateMachine)(T.task)({
  SwitchOn: () => async () => () => ({
    state: SM.tag('On'),
  }),
  SwitchOff: () => async () => () => ({
    state: SM.tag('Off'),
  }),
});
