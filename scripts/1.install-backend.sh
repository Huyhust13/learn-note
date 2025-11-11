#!/bin/bash

# check if you are in the backend directory by checking last element of path is backend
if [ "${PWD##*/}" != "backend" ]; then
  echo "${PWD##*/}"
  echo "Please run this script from the backend directory"
  exit
fi

npm install
