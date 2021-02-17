#!/bin/bash

tar czvf package.tar.gz package.json .env

scp -i "~/.ssh/eating.pem" package.tar.gz ubuntu@ec2-18-188-190-7.us-east-2.compute.amazonaws.com:~/.
rm package.tar.gz

ssh -i "~/.ssh/eating.pem" ubuntu@ec2-18-188-190-7.us-east-2.compute.amazonaws.com << 'ENDSSH'
pm2 stop ieating
pm2 delete ieating
rm -rf ieating
mkdir ieating
tar xf package.tar.gz -C ./ieating
rm package.tar.gz
cd ieating
npm install
ENDSSH

tar czf dist.tar.gz dist

scp -i "~/.ssh/eating.pem" dist.tar.gz ubuntu@ec2-18-188-190-7.us-east-2.compute.amazonaws.com:~/ieating
rm dist.tar.gz

ssh -i "~/.ssh/eating.pem" ubuntu@ec2-18-188-190-7.us-east-2.compute.amazonaws.com << 'ENDSSH'
cd ieating
rm -rf dist
tar xf dist.tar.gz -C ./
rm dist.tar.gz
pm2 start dist/app.js --name "ieating"

ENDSSH

