#!/bin/bash

set -o errexit
set -o nounset

export APP_SETTINGS="testing"
pip3 install -r requirements.txt

python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db migrate
python3 manage.py test