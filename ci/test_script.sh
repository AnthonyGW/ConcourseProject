#!/bin/bash

set -o errexit
set -o nounset

service postgresql start
su -c postgres createuser root

cd cpbackend_github_repo

export APP_SETTINGS="testing"
pip3 install -r requirements.txt

python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db migrate
python3 manage.py test
