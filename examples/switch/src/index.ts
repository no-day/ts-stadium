import * as S from '../../../src';
import * as T from 'fp-ts/Task';

type StateMachine = { states: { On: true; Off: false }; events: { Toggle: null } };

export const stateMachine = S.createStateMachine<StateMachine>()({
  states: { On: { events: ['Toggle'] }, Off: { events: ['Toggle'] } },
  events: { Toggle: { toStates: ['On', 'Off'] } },
});

// export const control = (c) =>
//   S.createControl(stateMachine, {
//     Toggle: (state) => T.of({ state: !state }),
//   });

// type Texture<E> = {
//   label: string;
//   onClick: () => E;
// };

// export const render = (c) =>
//   S.createRender(stateMachine, {
//     On: (state) => ({ label: 'On', event: () => null }),
//     Off: (state) => ({ label: 'On', event: () => null }),
//   });
