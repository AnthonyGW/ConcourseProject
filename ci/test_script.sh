#!/bin/bash

set -o errexit
set -o nounset

service postgresql start

cat cpbackend_github_repo/pg_hba > /etc/postgresql/9.5/main/pg_hba.conf

service postgresql restart

psql -U postgres -h localhost <<< "ALTER USER postgres with password 'postgres';\q"

cd cpbackend_github_repo

export APP_SETTINGS="testing"
pip3 install -r requirements.txt

python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db migrate
python3 manage.py test
