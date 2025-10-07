#!/bin/bash
# Script to copy build files to server/public
echo "Copying build files from dist/public to server/public..."
cp -r dist/public/* server/public/
echo "Build files copied successfully!"
ls -lh server/public/assets/*.js | wc -l
