import * as $ from '../src';

describe('index', () => {
  describe('createStateMachine', () => {
    it('returns itself', () => {
      expect(
        $.createStateMachine<any>()({
          states: {
            On: { events: ['Toggle'] },
            Off: { events: ['Toggle'] },
          },
          events: {
            Toggle: { toStates: ['On', 'Off'] },
          },
        })
      ).toStrictEqual({
        states: {
          On: { events: ['Toggle'] },
          Off: { events: ['Toggle'] },
        },
        events: {
          Toggle: { toStates: ['On', 'Off'] },
        },
      });
    });
  });
});
