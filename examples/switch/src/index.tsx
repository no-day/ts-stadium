import * as SM from '../../../src';
import * as React from 'react';
import { ReactElement } from 'react';

export const stateMachine = SM.createStateMachine({
  states: {
    On: {
      events: ['TurnOff', 'TurnOn'],
      init: true,
      data: SM.typeOf<string>(),
    },
    Off: {
      events: ['TurnOn'],
    },
  },

  events: {
    TurnOn: {
      toStates: ['On', 'Off'],
      data: SM.typeOf<boolean>(),
    },
    TurnOff: {
      toStates: ['Off'],
    },
  },
});

const control = SM.createControl(stateMachine)<'Promise'>({
  TurnOn: async () => (state) => ({
    state: SM.tag('On', ''),
  }),
  TurnOff: async () => () => ({ state: SM.tag('Off') }),
});

const Render = SM.createCbRender(stateMachine)<ReactElement>({
  On: () => (onEvent) => (
    <div onClick={() => onEvent(SM.tag('TurnOff'))}>Toggle</div>
  ),
  Off: () => (onEvent) => (
    <div onClick={() => onEvent(SM.tag('TurnOn', true))}>Toggle</div>
  ),
});

export const Compo = () => {
  const [state, setState] = React.useState(
    SM.init(stateMachine, SM.tag('On', ''))
  );

  return (
    <Render
      state={state}
      onEvent={(event) =>
        control(event, state).then((nn) => {
          const n = nn(state);
          n.state && setState(n.state);
          n.event && control(n.event, n.state || state);
        })
      }
    />
  );
};
