import stateMachine from '!!raw-loader!./src/state-machine.ts';
import control from '!!raw-loader!./src/control.ts';
import render from '!!raw-loader!./src/render.tsx';
import toggle from '!!raw-loader!./src/toggle.tsx';

export const srcs = {
  stateMachine: {
    fileName: 'toggle/src/state-machine.ts',
    source: stateMachine,
  },
  control: {
    fileName: 'toggle/src/control.ts',
    source: control,
  },
  render: {
    fileName: 'toggle/src/render.tsx',
    source: render,
  },
  toggle: {
    fileName: 'toggle/src/toggle.tsx',
    source: toggle,
  },
};
