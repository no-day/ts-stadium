import * as SM from '@ts-stadium/state-machine'

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
})
