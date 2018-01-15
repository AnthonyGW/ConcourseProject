#!/bin/bash

set -o errexit
set -o nounset

export APP_SETTINGS="testing"
python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db migrate
python3 manage.py test