#!/bin/bash

FILENAME=${1:-"patcher"}

# MacOS build
GOOS=darwin
GOARCH=amd64
go build -o "../dist/$FILENAME" .

# Windows build
GOOS=window
GOARCH=amd64
go build -o "../dist/$FILENAME.exe" .
