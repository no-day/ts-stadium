import * as SM from '@no-day/ts-stadium';

export const stateMachine = SM.createStateMachine({
  states: {
    On: {
      events: ['SwitchOff'],
    },
    Off: {
      events: ['SwitchOn'],
      init: true,
    },
  },

  events: {
    SwitchOff: {
      toStates: ['Off'],
    },
    SwitchOn: {
      toStates: ['On'],
    },
  },
});
