import * as cp from 'child_process'
import { pipe } from 'fp-ts/function'
import * as fs from 'fs'
import { glob } from 'glob'
import * as m from 'mustache'
import { Env } from './env'

export const genCodeDocs = ({ DEMO_LINK, API_LINK, ENV }: Env): void => {
  cp.execSync(
    `cp -r code-docs/README.md README${ENV === 'DEV' ? '.dev' : ''}.md`
  )

  const files = glob.sync(`README${ENV === 'DEV' ? '.dev' : ''}.md`)
  files.forEach((file) => {
    pipe(
      fs.readFileSync(file),
      (_) => _.toString(),
      (content) => m.render(content, { API_LINK, DEMO_LINK }),
      (content) => fs.writeFileSync(file, content)
    )
  })
}
