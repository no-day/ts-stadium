set -e
set -o pipefail

TMP=$(mktemp -d)
cd $TMP

git clone git@github.com:no-day/ts-stadium.git

cd ts-stadium

yarn install

yarn public
