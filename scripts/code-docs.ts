import { genCodeDocs } from '../chore/gen-code-docs'
import * as fse from 'fs-extra'

const env = {
  ...fse.readJsonSync('./env.json'),
}

console.log(env)

genCodeDocs(env)
