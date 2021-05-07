import { genDocs } from '../chore/gen-docs'
import { genPublic } from '../chore/gen-public'
import * as cp from 'child_process'
import * as lt from 'strong-log-transformer'
import * as chalk from 'chalk'
import { pipe } from 'fp-ts/lib/function'
import * as chokidar from 'chokidar'
import { Env } from '../chore/env'
import { genCodeDocs } from '../chore/gen-code-docs'

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

const devAPI = () => {
  genDocs({ SKIP_CHECKOUT_LATEST: true })

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

  chokidar.watch('docs/**/*.*').on('all', (event, path) => {
    genPublic(env)
  })
}

// const devGithub = () => {
//   genPublic(env)

//   pipe(
//     cp.exec(
//       `yarn markserv -l 35728 -b false -p ${config.github.port} README.md`
//     ),
//     prefixStream('markserv')
//   )

//   chokidar.watch('docs/**/*.*').on('all', (event, path) => {
//     console.log(event, path)
//   })
// }

const main = () => {
  genPublic(env)

  devGithub()

  devAPI()

  // pipe(
  //   cp.exec('bundle exec jekyll serve -l', { cwd: 'public' }),
  //   prefixStream('jekyll')
  // )

  // genDocs({ SKIP_CHECKOUT_LATEST: true })

  // pipe(
  //   cp.exec('yarn workspace @ts-stadium/demo develop', {
  //     env,
  //   }),
  //   prefixStream('gatsby')
  // )

  // pipe(
  //   cp.exec('bundle exec jekyll serve -l', { cwd: 'public' }),
  //   prefixStream('jekyll')
  // )
}

main()
