#!/bin/bash

mkdir -p output && chmod -R 777 output
docker build -t testapp:testtag .
docker-compose run --rm testapp
