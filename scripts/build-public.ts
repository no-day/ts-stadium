import * as fs from 'fs'
import frontMatter_ = require('front-matter')
import * as front_matter from 'front-matter'
import * as cp from 'child_process'
import * as path from 'path'
import * as fse from 'fs-extra'
import { pipe } from 'fp-ts/function'
import { glob } from 'glob'
import { genPublic } from '../chore/gen-public'
import { genDocs } from '../chore/gen-docs'
import { genDemo } from '../chore/gen-demo'

const SKIP_CHECKOUT_LATEST = Boolean(process.env['SKIP_CHECKOUT_LATEST'])
const SKIP_DEMO = Boolean(process.env['SKIP_DEMO'])

const env = {
  ...fse.readJsonSync('./env.json'),
  SKIP_CHECKOUT_LATEST,
  SKIP_DEMO,
}

const main = () => {
  if (!SKIP_CHECKOUT_LATEST) {
    cp.execSync(`git restore yarn.lock`)

    const result = cp.execSync('git status --porcelain').toString()

    if (result !== '') {
      console.error(`Git working directory not clean:\n${result}`)
      process.exit(1)
    }
  }

  genPublic(env)

  genDocs(env)

  if (!SKIP_DEMO) {
    genDemo({ ...env })
  }
}

main()
