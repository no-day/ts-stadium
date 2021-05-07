import * as T from "fp-ts/Task";
import * as SM from "@no-day/ts-stadium";

import { stateMachine } from "./state-machine";

export const control = SM.createControl(stateMachine)(T.task)({
  SwitchOn: () => async () => () => ({
    state: SM.tag("On"),
  }),
  SwitchOff: () => async () => () => ({
    state: SM.tag("Off"),
  }),
});
