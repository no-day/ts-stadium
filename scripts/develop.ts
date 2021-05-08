import { genDocs, genPackageDocs } from '../chore/gen-docs'
import { genPublic } from '../chore/gen-public'
import * as cp from 'child_process'
import * as lt from 'strong-log-transformer'
import * as chalk from 'chalk'
import { pipe } from 'fp-ts/lib/function'
import * as chokidar from 'chokidar'
import { Env } from '../chore/env'
import { genCodeDocs } from '../chore/gen-code-docs'
import {
  getWorkspaceLocations,
  getWorkspaceNames,
} from '../chore/get-workspaces'

const config = {
  gatsby: { port: 4002 },
  github: { port: 4000 },
  jekyll: { port: 4001 },
}

const env: Env = {
  API_LINK: `http://localhost:${config.jekyll.port}`,
  DEMO_LINK: `http://localhost:${config.gatsby.port}`,
  ENV: 'DEV',
  GITHUB_LINK: `http://localhost:${config.github.port}/README.dev.md`,
}

const prefixStream = (() => {
  const colorWheel = ['cyan', 'magenta', 'blue', 'yellow', 'green', 'red']
  let index = 0

  return (prefix: string) => (cp: cp.ChildProcess): cp.ChildProcess => {
    cp.stdout
      .pipe(
        lt({
          tag: chalk[colorWheel[index % (colorWheel.length - 1)]].bold(
            `${prefix}:`
          ),
        })
      )
      .pipe(process.stdout)
    cp.stderr
      .pipe(
        lt({
          tag: chalk[colorWheel[index % (colorWheel.length - 1)]].bold(
            `${prefix}*:`
          ),
        })
      )
      .pipe(process.stderr)
    index++

    return cp
  }
})()

const devGithub = () => {
  genCodeDocs(env)

  pipe(
    cp.exec(
      `yarn markserv --livereloadport 35728 --browser false --port ${config.github.port} README.dev.md`
    ),
    prefixStream('markserv')
  )

  chokidar.watch('code-docs/README.dev.md').on('all', (event, path) => {
    genCodeDocs(env)
  })
}

const devDemo = () => {
  cp.exec(`yarn workspace @ts-stadium/demo clean`)

  pipe(
    cp.exec(`yarn workspace @ts-stadium/demo develop`, {
      env: {
        GATSBY_API_LINK: env.API_LINK,
        GATSBY_GITHUB_LINK: env.GITHUB_LINK,
        PORT: config.gatsby.port.toString(),
      },
    }),
    prefixStream('gatsby')
  )
}

const devAPI = () => {
  pipe(
    cp.exec(`bundle exec jekyll serve -l --port ${config.jekyll.port}`, {
      cwd: 'public',
    }),
    prefixStream('jekyll')
  )

  chokidar.watch('packages/external/*/src/**/*.ts').on('all', (event, path) => {
    const regex = /(packages\/external\/.*)\/src/
    const workspaceLocation = path.match(regex)[1]
    const workspace = getWorkspaceLocations()[workspaceLocation].name

    genPackageDocs({ SKIP_CHECKOUT_LATEST: true, workspace })
  })
}

const main = () => {
  genPublic(env)

  //genDocs({ SKIP_CHECKOUT_LATEST: true })

  chokidar
    .watch('docs/**/*.*', { ignoreInitial: true })
    .on('all', (event, path) => {
      genPublic(env)
    })

  devGithub()
  devDemo()
  devAPI()
}

main()
