import * as React from "react"
import * as Switch from "../../../examples/switch/src"
import * as SM from "../../../src"
import { Graphviz } from "graphviz-react"
import { pipe } from "fp-ts/function"

const Page = () => (
  <div>
    Page switch
    <Graphviz dot={pipe(Switch.stateMachine, SM.toGraph, SM.graphToDot)} />
  </div>
)

export default Page
