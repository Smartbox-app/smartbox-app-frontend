UPDATEDBRANCH="$(printenv UPDATEDBRANCH)";
BRANCH="origin/$UPDATEDBRANCH";
git fetch --all
git reset --hard "$BRANCH"
echo "Using build script yarn build-$UPDATEDBRANCH"
yarn "build-$UPDATEDBRANCH"
chmod -R 0777 ./build
echo "done"

