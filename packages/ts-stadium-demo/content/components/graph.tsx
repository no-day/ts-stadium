import * as React from 'react';
import { Graphviz } from 'graphviz-react';
import { createGraph } from '@no-day/ts-stadium/graph';
import { renderDot } from '@no-day/ts-stadium/dot';
import { StateMachine } from '@no-day/ts-stadium';
import { pipe } from 'fp-ts/function';

export const Graph = ({
  stateMachine,
  graphAttrs = '',
}: {
  stateMachine: StateMachine;
  graphAttrs: string;
}) => {
  const dot = pipe(stateMachine, createGraph, renderDot);

  const dotPatched = dot.replace('digraph {', `digraph { ${graphAttrs}`);

  return (
    <div>
      <Graphviz dot={dotPatched} />
    </div>
  );
};
