#!/bin/bash

rm -rf output
mkdir -p output && chmod -R 777 output
docker build -t testapp:testtag .
docker run --shm-size='2gb' --network="host" -v $(pwd)/output:/output --rm testapp:testtag
