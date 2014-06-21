mkdir -p ../../bae/feedstore/public/scripts/mx
mkdir -p ../../bae/feedstore/public/scripts/fs/res

cd ~/Workspaces/MagicCube/feedstore-3.0

echo Synchronizing...
rsync -r -v --exclude-from "rsync-ignore.txt" "feedstore-node/" "../../bae/feedstore/"

echo
echo Synchronizing client resources...
rsync -r "feedstore-node/public/scripts/lib" "../../bae/feedstore/public/scripts"
rsync -r "feedstore-node/public/scripts/mx/res" "../../bae/feedstore/public/scripts/mx"
rsync "feedstore-node/public/scripts/mx/min.js" "../../bae/feedstore/public/scripts/mx"
rsync "feedstore-node/public/scripts/fs/min.js" "../../bae/feedstore/public/scripts/fs"
rsync -r --exclude "*.css" "feedstore-node/public/scripts/fs/res" "../../bae/feedstore/public/scripts/fs"
rsync "feedstore-node/public/scripts/fs/res/min.css" "../../bae/feedstore/public/scripts/fs/res/min.css"

echo
echo Submitting changes to BAE...
cd ~/Workspaces/bae/feedstore
git add -A
git commit -a -m "Commit changes."
git push

echo
echo Updating BAE
bae app publish

echo
bae log tail -f userapp --instanceid 172180 --max 40