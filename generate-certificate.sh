#!/bin/bask

mkdir -p certificate
openssl genrsa 1024 > certificate/key.pem
openssl req -x509 -new -key certificate/key.pem > certificate/key-cert.pem