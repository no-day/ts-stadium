import * as S from '../../../src';
import * as T from 'fp-ts/Task';

export const stateMachine = S.createStateMachine({
  states: {
    On: {},
    Off: { events: ['TurnOn', 'TurnOff'] },
  },
  events: {
    TurnOn: { toStates: ['On'] },
    TurnOff: { toStates: ['Off'] },
  },
});

export const control = S.createControl<T.URI>()(stateMachine, {
  TurnOn: () => T.of({ state: S.tag('On') }),
  TurnOff: () => T.of({ state: S.tag('Off') }),
});
