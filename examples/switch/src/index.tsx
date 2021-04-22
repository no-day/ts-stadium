import * as S from '../../../src';
import * as T from 'fp-ts/Task';
import * as I from 'fp-ts/IO';
import * as React from 'react';
import { ReactElement } from 'react';

export const stateMachine = S.createStateMachine({
  inits: ['On', 'Off'],
  states: {
    On: { events: ['TurnOff', 'TurnOn'] },
    Off: { events: ['TurnOn'] },
  },
  events: {
    TurnOn: { toStates: ['On'] },
    TurnOff: { toStates: ['Off'] },
  },
});

const control = S.createControl<'Promise'>()(stateMachine, {
  TurnOn: async () => ({ state: S.tag('On') }),
  TurnOff: async () => ({ state: S.tag('Off') }),
});

const Render = S.createCallbackRender<ReactElement>()(stateMachine, {
  On: () => (onEvent) => (
    <div onClick={() => onEvent(S.tag('TurnOff'))}>Toggle</div>
  ),
  Off: () => (onEvent) => (
    <div onClick={() => onEvent(S.tag('TurnOn'))}>Toggle</div>
  ),
});

export const Compo = () => {
  const [state, setState] = React.useState<S.StateData<typeof stateMachine>>(
    S.tag('On')
  );

  <Render
    state={state}
    onEvent={(event) =>
      control(event, state).then((n) => {
        setState(n.state);
        control(n.event, n.state);
      })
    }
  />;
};
