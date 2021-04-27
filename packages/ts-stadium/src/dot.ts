/** @since 1.0.0 */

import * as Graphviz from 'ts-graphviz';
import { StateMachineGraph, Node, Edge } from './graph';
import { pipe } from 'fp-ts/function';
import { tag } from './types';

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

const mkNode = (graph: Graphviz.Digraph) => (
  node: Node
): Graphviz.NodeAttributes => {
  switch (node.tag) {
    case 'State':
      return {
        shape: 'box',
        style: 'rounded, filled',
        fillcolor: '#82E0AA',
        penwidth: '1',
        ...(node.data.isInit ? { penwidth: '2' } : {}),
      };
    case 'Event':
      return {
        shape: 'box',
        style: 'filled',
        fillcolor: '#F6DDCC',
        height: 0.2,
      };
  }
};

const mkEdge = (graph: Graphviz.Digraph) => (
  edge: Edge
): Graphviz.EdgeAttributes =>
  ({
    FromState: () => ({}),
    FromEvent: () => ({}),
  }[edge.tag]());

/**
 * Renders a state machine graph to a dot file
 *
 * @since 1.0.0
 * @category Constructor
 */
export const renderDot = (graph: StateMachineGraph): Dot => {
  const g = Graphviz.digraph();

  graph.nodes.forEach((node) => g.createNode(node.data.id, mkNode(g)(node)));

  graph.edges.forEach((edge) =>
    g.createEdge([edge.data.from, edge.data.to], mkEdge(g)(edge))
  );

  return pipe(g, Graphviz.toDot, unsafeMkDot);
};

// -----------------------------------------------------------------------------
// Internal
// -----------------------------------------------------------------------------

const unsafeMkDot = (dot: string): Dot => dot as Dot;
