#!/bin/bash

# check sudo permission
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

apt update
apt upgrade -y
apt install nodejs npm -y
