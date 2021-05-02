import * as $ from '../src';
import * as React from 'react';
import * as T from 'fp-ts/Task';
import { URItoKind } from 'fp-ts/HKT';

describe('index', () => {
  describe('createStateMachine', () => {
    it('works for empty states and events', () => {
      expect(
        $.createStateMachine({
          states: {},
          events: {},
        })
      ).toStrictEqual({
        states: {},
        events: {},
      });
    });

    it('works for one state and no events', () => {
      expect(
        $.createStateMachine({
          states: { Unit: {} },
          events: {},
        })
      ).toStrictEqual({
        states: {
          Unit: {
            data: undefined,
            events: [],
            init: false,
          },
        },
        events: {},
      });
    });

    it('works for one state and one event', () => {
      expect(
        $.createStateMachine({
          states: { Unit: {} },
          events: { Identity: {} },
        })
      ).toStrictEqual({
        states: {
          Unit: {
            data: undefined,
            events: [],
            init: false,
          },
        },
        events: {
          Identity: {
            data: undefined,
            toStates: [],
            toEvents: [],
          },
        },
      });
    });

    it('works for a Toggle', () => {
      expect(
        $.createStateMachine({
          states: { On: {}, Off: {} },
          events: {
            SwitchOn: { toStates: ['On'] },
            SwitchOff: { toStates: ['Off'] },
          },
        })
      ).toStrictEqual({
        states: {
          On: {
            data: undefined,
            events: [],
            init: false,
          },
          Off: {
            data: undefined,
            events: [],
            init: false,
          },
        },
        events: {
          SwitchOn: {
            data: undefined,
            toStates: ['On'],
            toEvents: [],
          },
          SwitchOff: {
            data: undefined,
            toStates: ['Off'],
            toEvents: [],
          },
        },
      });
    });
  });
});
