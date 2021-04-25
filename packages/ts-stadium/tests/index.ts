import * as $ from '../src';
import * as React from 'react';
import * as T from 'fp-ts/Task';
import { URItoKind } from 'fp-ts/HKT';

const stateMachine = $.createStateMachine({
  states: { On: {}, Off: {} },
  events: { SwitchOn: { toStates: ['On'] } },
});

const control = $.createControl(stateMachine)<T.URI>(T.task)({
  SwitchOn: (st) => async () => (st2) => ({
    state: $.tag('On'),
  }),
});

type T = URItoKind<'Taskss'>;

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
          },
          Off: {
            data: undefined,
            events: [],
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
