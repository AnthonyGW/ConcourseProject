#!/bin/bash

set -o errexit
set -o nounset

sudo apt install -yv python3-pip
sudo apt-get install -yv postgresql postgresql-contrib
sudo apt-get install -yv python-psycopg2
sudo apt-get install -yv libpq-dev

export APP_SETTINGS="testing"
pip install -r requirements.txt

python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db migrate
python3 manage.py test
