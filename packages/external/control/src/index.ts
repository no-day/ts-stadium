/** @since 1.0.0 */

import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/HKT";
import { pipe } from "fp-ts/function";
import * as R from "fp-ts/Record";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { eqStrict } from "fp-ts/Eq";
import { Monad1 } from "fp-ts/Monad";
import {
  NoData,
  Tagged,
  Union,
  TupleToUnion,
  Normalize,
  Tuple,
  RecordVal,
} from "@ts-stadium/type-utils";
import * as SM from "@ts-stadium/state-machine";

import StateMachine = SM.StateMachine;

// ----------------------------------------------------------------------------
// Control
// ----------------------------------------------------------------------------

type ControlEvents<C extends URIS, SM extends StateMachine> = {
  [E in SM.Event<SM>]: (
    state: SM["states"][SM.CoStateToEvent<SM, E>]["data"]
  ) => Kind<
    C,
    (
      state: SM["states"][SM.CoStateToEvent<SM, E>]["data"]
    ) => {
      event?: SM["states"][SM.EventToEvent<SM, E>]["data"];
      state?: SM["states"][SM.EventToState<SM, E>]["data"];
    }
  >;
};

/**
 * @since 1.0.0
 * @category Control
 * @example
 *   import * as SM from "@ts-stadium/control";
 *
 *   const stateMachine = SM.createStateMachine({
 *     states: {
 *       On: { events: ["Toggle"] },
 *       Off: { events: ["Toggle"] },
 *     },
 *     events: {
 *       Toggle: { toStates: ["On", "Off"] },
 *     },
 *   });
 *
 *   const control = SM.createControl(stateMachine, {
 *     Toggle: () => Promise.resolve(SM.tag("On")),
 *   });
 */
export const createControl = <SM extends StateMachine>(stateMachine: SM) => <
  C extends URIS
>(
  C: Monad1<C>
) => (controlEvents: ControlEvents<C, SM>) => (
  event: SM.EventData<SM>,
  state: SM.StateData<SM>
): Kind<C, GetNext<SM>> =>
  A.elem(eqStrict)(event.tag, stateMachine.states[state.tag].events)
    ? // Capture Event
      controlEvents[event.tag](state)
    : // Drop Event
      C.of({} as GetNext<SM>);

type GetNext<SM extends StateMachine> = (
  state: Union<SM.MapData<SM["states"]>>
) => {
  event?: Union<SM.MapData<SM["states"]>>;
  state?: Union<SM.MapData<SM["states"]>>;
};

// // ----------------------------------------------------------------------------
// // Render
// // ----------------------------------------------------------------------------

// type RenderStates<R extends URIS, SM extends StateMachine> = {
//   [S in State<SM>]: (
//     state: SM['states'][S]['data']
//   ) => Kind<R, SM['events'][StateOutgoingEvent<S, SM>]['data']>;
// };

// type RenderStates2<R extends URIS2, B, SM extends StateMachine> = {
//   [S in State<SM>]: (
//     state: SM['states'][S]['data']
//   ) => Kind2<R, B, SM['events'][StateOutgoingEvent<S, SM>]['data']>;
// };

// /**
//  * @since 1.0.0
//  * @category Render
//  */
// export const createRender: {
//   <SM extends StateMachine>(stateMachine: SM): <R extends URIS2, B>(
//     renderStates: RenderStates2<R, B, SM>
//   ) => (state: StateData<SM>) => Kind2<R, B, EventData<SM>>;

//   <SM extends StateMachine>(stateMachine: SM): <R extends URIS>(
//     renderStates: RenderStates<R, SM>
//   ) => (state: StateData<SM>) => Kind<R, EventData<SM>>;
// } = (stateMachine: any) => (renderStates: any) => (state: any) =>
//   renderStates[state.tag](state);

const o = {
  b: 3,
  a: 1,
};
