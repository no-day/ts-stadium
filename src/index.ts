/** @since 1.0.0 */

// --------------------------------------------------------------------------------------------------------------------
// Util
// --------------------------------------------------------------------------------------------------------------------

/**
 * It's a greeting
 *
 * @since 1.0.0
 * @category Util
 * @example
 *   import { createStateMachine } from 'fp-ts-library-template';
 *
 *   createStateMachine()({
 *     states: { On: { events: ['Toggle'] }, Off: { events: ['Toggle'] } },
 *     events: { Toggle: { toStates: ['On', 'Off'] } },
 *   });
 */

export const createStateMachine = <T extends TSpec>() => <spec extends Spec<T>>(spec: spec): StateMachine<T> =>
  (spec as unknown) as StateMachine<T>;

// --------------------------------------------------------------------------------------------------------------------
// Internal
// --------------------------------------------------------------------------------------------------------------------

type TSpec = { states: Record<any, any>; events: Record<any, any> };

type Spec<T extends TSpec> = {
  states: Record<keyof T['states'], { events: (keyof T['events'])[] }>;
  events: Record<keyof T['events'], { toStates?: (keyof T['states'])[]; toEvents?: (keyof T['events'])[] }>;
};

type StateMachine<T extends TSpec> = {
  states: {
    [key in keyof T['states']]: {
      data: T['states'][key];
      events: (keyof T['events'])[];
    };
  };
  events: {
    [key in keyof T['events']]: {
      data: T['events'][key];
      toStates?: (keyof T['states'])[];
      toEvents?: (keyof T['events'])[];
    };
  };
};
