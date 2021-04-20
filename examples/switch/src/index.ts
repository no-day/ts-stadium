import * as S from '../../../src';
import * as T from 'fp-ts/Task';

export const stateMachine = S.createStateMachine({
  states: {
    On: { events: ['TurnOff'] },
    Off: { events: ['TurnOn'] },
  },
  events: {
    TurnOn: { toStates: ['On'] },
    TurnOff: { toStates: ['Off'] },
  },
});

export const control = S.createControl<T.URI>()(stateMachine, {
  TurnOn: (state) => T.of({ state: S.tag('On') }),
  TurnOff: (state) => T.of({ state: S.tag('Off') }),
});
