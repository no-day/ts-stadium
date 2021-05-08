import * as cp from 'child_process'
import { pipe } from 'fp-ts/function'

type Workspace = { location: string; name: string }

const getWorkspaces = (): Workspace[] =>
  pipe(
    cp.execSync('yarn workspaces list --json'),
    (_) => _.toString(),
    (_) => _.trim(),
    (_) => _.split('\n'),
    (_) => _.map((s) => JSON.parse(s))
  )

export const getWorkspaceNames = (): Record<string, Workspace> =>
  pipe(getWorkspaces(), (_) =>
    _.reduce((acc, x) => ({ ...acc, [x.name]: x }), {})
  )

export const getWorkspaceLocations = (): Record<string, Workspace> =>
  pipe(getWorkspaces(), (_) =>
    _.reduce((acc, x) => ({ ...acc, [x.location]: x }), {})
  )
