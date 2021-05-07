import * as cp from 'child_process'
import { genCodeDocs } from '../chore/gen-code-docs'
import * as fse from 'fs-extra'

const env = {
  ...fse.readJsonSync('./env.json'),
}

genCodeDocs(env)
