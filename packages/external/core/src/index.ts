/** @since 1.0.0 */

// ----------------------------------------------------------------------------
// Util
// ----------------------------------------------------------------------------

/**
 * Some Name
 *
 * @since 1.0.0
 * @category Util
 */
export type NameCore = string | symbol | number;

// /** @since 1.0.0 */

// // ----------------------------------------------------------------------------
// // Model
// // ----------------------------------------------------------------------------

// /**
//  * A type that describes data relations of a state machine.
//  *
//  * @since 1.0.0
//  * @category Constructors
//  */
//  export interface StateMachine<SMS extends StateMachineSpec = StateMachineSpec> {
//     states: {
//       [S in keyof SMS['states']]: {
//         data: Tagged<S, Normalize<SMS['states'][S]['data'], NoData>>;
//         events: Normalize<SMS['states'][S]['events'], []>;
//         init: Normalize<SMS['states'][S]['init'], false>;
//       };
//     };

//     events: {
//       [E in keyof SMS['events']]: {
//         data: Tagged<E, Normalize<SMS['events'][E]['data'], NoData>>;
//         toStates: Normalize<SMS['events'][E]['toStates'], []>;
//         toEvents: Normalize<SMS['events'][E]['toEvents'], []>;
//       };
//     };
//   }

//   // ----------------------------------------------------------------------------
//   // Constructors
//   // ----------------------------------------------------------------------------

//   /**
//    * Describes state and transition relations of a state machine. Argument fop
//    * `createStateMachine`.
//    *
//    * @since 1.0.0
//    * @category Constructors
//    */
//   export interface StateMachineSpec<
//     S extends Name = Name,
//     E extends Name = Name
//   > {
//     states: Record<
//       S,
//       {
//         data?: any;
//         events?: Tuple<E>;
//         init?: boolean;
//       }
//     >;

//     events: Record<
//       E,
//       {
//         data?: any;
//         toStates?: Tuple<S>;
//         toEvents?: Tuple<E>;
//       }
//     >;
//   }

//   const normailizeSMState = ({
//     events = [],
//     data,
//     init = false,
//   }: RecordVal<StateMachineSpec['states']>): RecordVal<
//     StateMachine['states']
//   > => ({ data, events, init });

//   const normailizeSMEvent = ({
//     data,
//     toEvents = [],
//     toStates = [],
//   }: RecordVal<StateMachineSpec['events']>): RecordVal<
//     StateMachine['events']
//   > => ({ data, toEvents, toStates });

//   const unsafeCreateStateMachine = (
//     data: Omit<StateMachine, 'StateMachine'>
//   ): StateMachine => data as StateMachine;

//   /**
//    * Creates a state machine, given a data type and a description of valid transitions.
//    *
//    * @since 1.0.0
//    * @category Constructors
//    * @example
//    *   import { createStateMachine } from '@ts-stadium/core';
//    *
//    *   const stateMachine = createStateMachine({
//    *     states: {
//    *       On: { events: ['Toggle'] },
//    *       Off: { events: ['Toggle'] },
//    *     },
//    *     events: {
//    *       Toggle: { toStates: ['On', 'Off'] },
//    *     },
//    *   });
//    */
//   export const createStateMachine = <
//     SMS extends StateMachineSpec<keyof SMS['states'], keyof SMS['events']>
//   >(
//     spec: SMS
//   ): Extract<StateMachine<SMS>> =>
//     unsafeCreateStateMachine({
//       states: pipe(spec.states, R.map(normailizeSMState)) as any,
//       events: pipe(spec.events, R.map(normailizeSMEvent)) as any,
//     }) as StateMachine<SMS>;

//   // ----------------------------------------------------------------------------
//   // Internal
//   // ----------------------------------------------------------------------------
