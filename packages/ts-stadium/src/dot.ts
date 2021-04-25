/** @since 1.0.0 */

import * as Graphviz from 'ts-graphviz';
import { StateMachineGraph } from './graph';
import { pipe } from 'fp-ts/function';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Branded type for dot files
 *
 * @since 1.0.0
 * @category Model
 */
export type Dot = string & { readonly Dot: unique symbol };

// -----------------------------------------------------------------------------
// Constructor
// -----------------------------------------------------------------------------

/**
 * Renders a state machine graph to a dot file
 *
 * @since 1.0.0
 * @category Constructor
 */
export const renderDot = (graph: StateMachineGraph): Dot => {
  const g = Graphviz.digraph();

  graph.nodes.forEach((node) =>
    g.createNode(
      node.id,
      {
        State: {
          shape: 'box',
          style: 'rounded, filled',
          fillcolor: '#82E0AA',
        },
        Event: {
          shape: 'box',
          style: 'filled',
          fillcolor: '#F6DDCC',
          height: 0.2,
        },
      }[node.tag]
    )
  );

  graph.edges.forEach((edge) => g.createEdge([edge.from, edge.to]));

  return pipe(g, Graphviz.toDot, unsafeMkDot);
};

// -----------------------------------------------------------------------------
// Internal
// -----------------------------------------------------------------------------

const unsafeMkDot = (dot: string): Dot => dot as Dot;
