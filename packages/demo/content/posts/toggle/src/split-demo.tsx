import * as React from 'react';
import * as SM from '@no-day/ts-stadium';

import { Split } from '@ts-stadium/demo/components/split';
import { Graph } from '@ts-stadium/demo/components/graph';

import { stateMachine } from './state-machine';
import { Toggle } from './toggle';
import { Render } from './render';

const graphAttrs = `
  rankdir=LR
  center=true
  {rank=same; SwitchOff, SwitchOn }
  {rank=min; On }
  {rank=max; Off }
`;

export const SplitDemo = () => {
  const [state, setState] = React.useState(
    SM.init(stateMachine, SM.tag('Off'))
  );

  return (
    <Split>
      <Render state={state} onEvent={() => {}} />
      <Graph
        stateMachine={stateMachine}
        graphAttrs={graphAttrs}
        state={state.tag}
      />
    </Split>
  );
};
