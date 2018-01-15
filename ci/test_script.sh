#!/bin/bash

set -o errexit
set -o nounset

apt-get install -yv python3-pip

git clone https://github.com/AnthonyGW/ConcourseProject.git

cd ConcourseProject

export APP_SETTINGS="testing"
pip3 install -r requirements.txt

python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db migrate
python3 manage.py test
