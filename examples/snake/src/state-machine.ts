import * as S from '../../../src';

export const stateMachine = S.createStateMachine<any>()({
  states: {
    Init: { events: ['Start'] },
    Playing: { events: ['Pause', 'Move'] },
    Paused: { events: ['Resume'] },
    End: { events: ['Start'] },
  },
  events: {
    Start: { toStates: ['Playing'] },
    Tick: { toStates: ['Playing'], toEvents: ['Tick'] },
    Move: { toStates: ['Playing'] },
    Pause: { toStates: ['Paused'] },
    Resume: { toStates: ['Playing'] },
  },
});
