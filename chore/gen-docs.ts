import * as fs from 'fs'
import frontMatter_ = require('front-matter')
import * as front_matter from 'front-matter'
import * as cp from 'child_process'
import * as path from 'path'
import { pipe } from 'fp-ts/function'
import { glob } from 'glob'
import { getWorkspaces } from './get-workspaces'

const frontMatter = (frontMatter_ as unknown) as (
  str: string
) => front_matter.FrontMatterResult<Record<string, unknown>>

export const genPackageDocs = ({
  workspace,
  SKIP_CHECKOUT_LATEST,
}: {
  workspace: string
  SKIP_CHECKOUT_LATEST: boolean
}): void => {
  console.log(`Generate docs for ${workspace} ...`)
  if (!SKIP_CHECKOUT_LATEST) {
    const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`)
    cp.execSync(`git restore yarn.lock`, { stdio: 'inherit' })
    cp.execSync(`git checkout ${tag}`, { stdio: 'inherit' })
    cp.execSync('yarn install', { stdio: 'inherit' })
  }
  cp.execSync(`yarn workspace ${workspace} docs`, { stdio: 'inherit' })

  const workspaceLocation = getWorkspaces()[workspace].location

  const version = pipe(
    fs.readFileSync(path.join(workspaceLocation, `package.json`)),
    (_) => _.toString(),
    JSON.parse,
    (_) => _.version
  )
  const unscopedName = workspace.split('/')[1]
  const targetDir = `public/packages/${unscopedName}`
  cp.execSync(`mkdir -p ${targetDir}`)
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  )
  cp.execSync(
    `cp -r ${path.join(workspaceLocation, 'docs/modules/*')} ${targetDir}`
  )
  cp.execSync(
    `mv ${path.join(targetDir, 'index.ts.md')} ${path.join(
      targetDir,
      'index.md'
    )}`
  )
  const files = glob.sync(path.join(targetDir, '*.md'))
  files.forEach((file) => {
    pipe(
      fs.readFileSync(file),
      (_) => _.toString(),
      (str) => frontMatter(str),
      (result) =>
        path.parse(file).base === 'index.md'
          ? {
              ...result,
              attributes: {
                ...result.attributes,
                parent: 'packages',
                permalink: `/packages/${unscopedName}`,
                title: unscopedName,
              },
            }
          : {
              ...result,
              attributes: {
                ...result.attributes,
                grand_parent: 'packages',
                parent: unscopedName,
              },
            },
      (result) =>
        fs.writeFileSync(
          file,
          `---\n${JSON.stringify(result.attributes, null, 2)}\n---\n\n${
            result.body
          }`
        )
    )
  })
  cp.execSync(`git checkout main`)
  console.log('done')
}

export const genDocs = (env: { SKIP_CHECKOUT_LATEST: boolean }): void =>
  [
    '@ts-stadium/graph',
    '@ts-stadium/type-utils',
    '@ts-stadium/state-machine',
  ].forEach((workspace) => genPackageDocs({ ...env, workspace }))
