import * as React from "react"
import * as Switch from "../../../examples/switch/src"
import { createStateMachine } from "../../../src"
import { createGraph } from "../../../src/graph"
import { renderDot } from "../../../src/dot"
import { Graphviz } from "graphviz-react"
import { pipe } from "fp-ts/function"

const Page = () => (
  <div>
    Page switch
    <Graphviz
      dot={pipe(
        Switch.stateMachine,
        createStateMachine(),
        createGraph,
        renderDot
      )}
    />
  </div>
)

export default Page
