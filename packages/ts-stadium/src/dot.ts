/** @since 1.0.0 */

import * as Graphviz from 'ts-graphviz';
import { StateMachineGraph, Node, Edge } from './graph';
import { pipe } from 'fp-ts/function';
import { tag } from './types';
import chroma from 'chroma-js';

const colors = {
  background: pipe(chroma('#353535'), (color) => ({
    light: color,
    dark: color,
  })),

  node: {
    state: {
      background: pipe(chroma('#00cc66'), (color) => ({
        light: color.darken(1),
        dark: color.darken(3.5),
      })),
    },
    event: {
      background: pipe(chroma('#ff9933'), (color) => ({
        light: color.darken(1),
        dark: color.darken(3.5),
      })),
    },
  },

  edge: {
    background: pipe(chroma('#534e56'), (color) => ({
      light: color,
      dark: color,
    })),
  },

  outline: pipe(chroma('#99ccff'), (color) => ({
    light: color,
    dark: color.darken(2.5),
  })),
};

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
  const common: Graphviz.NodeAttributes = {
    fontsize: 10,
    fontname: 'Arial',
  };

  switch (node.tag) {
    case 'State':
      return pipe(
        {
          penwidth: 1,
          fillcolor: colors.node.state.background,
          color: colors.outline,
        },

        (s) =>
          node.data.isInit
            ? {
                penwidth: s.penwidth + 1,
                fillcolor: s.fillcolor,
                color: s.color,
              }
            : s,

        (s) =>
          node.data.isSelected
            ? {
                penwidth: s.penwidth,
                fillcolor: s.fillcolor.light,
                color: s.color.light,
              }
            : {
                penwidth: s.penwidth,
                fillcolor: s.fillcolor.dark,
                color: s.color.dark,
              },

        (s) =>
          ({
            ...common,
            shape: 'box',
            style: 'rounded, filled',
            fillcolor: s.fillcolor.hex(),
            penwidth: s.penwidth,
            color: s.color.hex(),
            height: 0.1,
            fontcolor: s.color.hex(),
          } as Graphviz.NodeAttributes)
      );

    case 'Event':
      return pipe(
        {
          fillcolor: colors.node.event.background,
          color: colors.outline,
        },

        (s) =>
          node.data.isReachable
            ? {
                fillcolor: s.fillcolor.light,
                color: s.color.light,
              }
            : {
                fillcolor: s.fillcolor.dark,
                color: s.color.dark,
              },

        (s) =>
          ({
            ...common,
            shape: 'box',
            style: 'filled',
            fillcolor: s.fillcolor.hex(),
            color: s.color.hex(),
            height: 0.1,
            fontcolor: s.color.hex(),
          } as Graphviz.NodeAttributes)
      );
  }
};

const mkEdge = (graph: Graphviz.Digraph) => (
  edge: Edge
): Graphviz.EdgeAttributes => {
  const common: Graphviz.EdgeAttributes = {
    arrowsize: 0.5,
  };

  switch (edge.tag) {
    case 'FromState':
      return pipe(
        {
          color: colors.outline,
        },

        (s) =>
          edge.data.isReachable
            ? {
                color: s.color.light,
              }
            : {
                color: s.color.dark,
              },

        (s) =>
          ({
            ...common,
            color: s.color.hex(),
          } as Graphviz.EdgeAttributes)
      );

    case 'FromEvent':
      return pipe(
        {
          color: colors.outline,
        },

        (s) =>
          edge.data.isReachable
            ? {
                color: s.color.light,
              }
            : {
                color: s.color.dark,
              },

        (s) =>
          ({
            ...common,
            color: s.color.hex(),
          } as Graphviz.EdgeAttributes)
      );
  }
};

/**
 * Renders a state machine graph to a dot file
 *
 * @since 1.0.0
 * @category Constructor
 */
export const renderDot = (graph: StateMachineGraph): Dot => {
  const g = Graphviz.digraph();

  g.graph({
    bgcolor: colors.background.dark.hex(),
  });

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
