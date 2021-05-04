set -e
set -o pipefail

LOCAL_CHECKOUT=$PWD
TMP=$(mktemp -d)

cd $TMP

echo TMP DIR: $TMP
echo LOCAL_CHECKOUT DIR: $LOCAL_CHECKOUT

git clone $LOCAL_CHECKOUT

cd ts-stadium

yarn install

yarn public
