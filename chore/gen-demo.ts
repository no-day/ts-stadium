import * as fs from 'fs'
import * as cp from 'child_process'
import * as path from 'path'
import { pipe } from 'fp-ts/function'
import { getWorkspaceNames } from './get-workspaces'
import { Env } from './env'

export const genDemo = ({
  SKIP_CHECKOUT_LATEST,
  API_LINK,
  GITHUB_LINK,
}: {
  SKIP_CHECKOUT_LATEST: boolean
} & Env): void => {
  const workspace = '@ts-stadium/demo'
  if (!SKIP_CHECKOUT_LATEST) {
    const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`)
    cp.execSync(`git restore yarn.lock`, { stdio: 'inherit' })
    cp.execSync(`git checkout ${tag}`, { stdio: 'inherit' })
    cp.execSync('yarn install', { stdio: 'inherit' })
  }
  cp.execSync(`yarn workspace ${workspace} build --prefix-paths`, {
    env: {
      GATSBY_API_LINK: API_LINK,
      GATSBY_GITHUB_LINK: GITHUB_LINK,
    },
    stdio: 'inherit',
  })
  const workspaceLocation = getWorkspaceNames()[workspace].location
  const version = pipe(
    fs.readFileSync(path.join(workspaceLocation, `package.json`)),
    (_) => _.toString(),
    JSON.parse,
    (_) => _.version
  )
  const targetDir = `public/demo`
  cp.execSync(`mkdir -p ${targetDir}`)
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  )
  cp.execSync(`cp -r ${path.join(workspaceLocation, 'public/*')} ${targetDir}`)
  cp.execSync(`git checkout main`)
}
