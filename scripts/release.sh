TMP=$(mktemp -d)
cd $TMP
git clone git@github.com:no-day/ts-stadium.git
cd ts-stadium

yarn install

yarn check

yarn lerna publish from-package --yes --no-verify-access
