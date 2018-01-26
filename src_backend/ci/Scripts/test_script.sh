#!/bin/bash

set -o errexit
set -o nounset

service postgresql start

cat cp_github_repo/src_backend/ci/Scripts/pg_hba > /etc/postgresql/9.5/main/pg_hba.conf

service postgresql restart

psql -U postgres -h localhost <<< "ALTER USER postgres with password 'postgres';CREATE DATABASE test_db;\q"

cd cp_github_repo/src_backend

export APP_SETTINGS="testing"
pip3 install -r requirements.txt

python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db upgrade
python3 manage.py test

cp -a ../src_backend/. ../../backend_build
