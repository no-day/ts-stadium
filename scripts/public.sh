rm -rf public

mkdir public

# DOCS

mkdir public/docs

git checkout $(git describe --match "@ts-stadium/core@*" HEAD)
yarn install
yarn workspace @ts-stadium/core docs-ts
VERSION=
cp -r packages/core/docs public/docs/core/$VERSION

cp docs/_config.yml public

# DEMO

git checkout $(git describe --match "@no-day/ts-stadium-demo*" HEAD)
yarn install
yarn workspace @no-day/ts-stadium-demo build

cp -r packages/ts-stadium-demo/public public/demo

git checkout HEAD
