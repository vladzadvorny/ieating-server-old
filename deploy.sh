#!/bin/bash

tar czf dist.tar.gz dist

scp -i "~/.ssh/eating.pem" dist.tar.gz ubuntu@ec2-18-188-190-7.us-east-2.compute.amazonaws.com:~/ieating
rm dist.tar.gz

ssh -i "~/.ssh/eating.pem" ubuntu@ec2-18-188-190-7.us-east-2.compute.amazonaws.com << 'ENDSSH'
cd ieating
rm -rf dist
tar xf dist.tar.gz -C ./
rm dist.tar.gz
pm2 stop ieating
pm2 start ieating

ENDSSH