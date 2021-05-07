import * as cp from 'child_process'
import { pipe } from 'fp-ts/function'

export const getWorkspaces = (): Record<string, { location: string }> =>
  pipe(
    cp.execSync('yarn workspaces list --json'),
    (_) => _.toString(),
    (_) => _.trim(),
    (_) => _.split('\n'),
    (_) => _.map((s) => JSON.parse(s)),
    (_) => _.reduce((acc, x) => ({ ...acc, [x.name]: x }), {})
  )
