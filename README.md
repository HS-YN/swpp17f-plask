# Plask!

## How to run the service: run both the Frontend and the Backend at the same time.
### Frontend: (run the following command in Plask-Frontend folder)
            npm start
### Backend: (run the following command in PlaskBack folder)
            python3 manage.py runserver

## How to test the service:
### Frontend: (run the following commands in Plask-Frontend folder)
            ng test --code-coverage
            http-server -c-1 -o -p 9876 ./coverage
### Backend: (Type in the following commands in PlaskBack folder)
            coverage run --branch --source='./user' manage.py test user
            coverage report
