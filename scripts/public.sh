rm -rf public

mkdir public

# DOCS

mkdir public/docs

yarn workspace @ts-stadium/core docs-ts
cp -r packages/core/docs public/docs/core

cp docs/_config.yml public

# DEMO

yarn workspace @no-day/ts-stadium-demo build

cp -r packages/ts-stadium-demo/public public/demo
