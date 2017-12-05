# Plask!

[![Coverage Status](https://coveralls.io/builds/14395832/badge)](https://coveralls.io/builds/14395832)
[![Build Status](https://travis-ci.org/swsnu/swpp17-team6.svg?branch=master)](https://travis-ci.org/swsnu/swpp17-team6)

## How to run the service: run both the Frontend and the Backend at the same time.
### Frontend: (run the following command in Plask-Frontend folder)
            npm start
### Backend: (run the following command in PlaskBack folder)
            python3 manage.py runserver

## How to test the service:
### Frontend: (run the following commands in Plask-Frontend folder)
            ng test --code-coverage
            http-server -c-1 -o -p 9876 ./coverage
### Backend: (Type in the following commands in PlaskBack folder / Test for each app)
            coverage run --branch --source='./(app_name)' manage.py test (app_name)
            coverage report


## Documents
* [API url and Http Response](https://github.com/swsnu/swpp17-team6/wiki/API-url-and-HTTP-Response)
* [Design and Planning](https://github.com/swsnu/swpp17-team6/wiki/Design-and-Planning)
* [Project Requirements and Specification](https://github.com/swsnu/swpp17-team6/wiki/Project-Requirements-and-Specification)
