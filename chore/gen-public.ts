import * as cp from 'child_process'
import { pipe } from 'fp-ts/function'
import * as fs from 'fs'
import { glob } from 'glob'
import * as m from 'mustache'
import { Env } from './env'

export const genPublic = ({ DEMO_LINK, GITHUB_LINK }: Env): void => {
  cp.execSync('mkdir -p public')
  cp.execSync('rm -rf public/*')
  cp.execSync('mkdir -p public/packages')
  cp.execSync('cp -r docs/* -t public')

  const files = glob.sync('public/_config.yml')
  files.forEach((file) => {
    pipe(
      fs.readFileSync(file),
      (_) => _.toString(),
      (content) => m.render(content, { DEMO_LINK, GITHUB_LINK }),
      (content) => fs.writeFileSync(file, content)
    )
  })
}
