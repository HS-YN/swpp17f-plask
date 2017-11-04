import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';


@Injectable()
export class UserService{

    //List of Urls for API
    private signInUrl = '/api/user/signin/'; //URL to signin
    private signUpUrl = '/api/user/signup/'; //URL to signup
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    signIn(user: User): Promise<number>{
        return this.http
            .post(this.signInUrl, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    signUp(user: User): Promise<number>{
        return this.http
            .post(this.signUpUrl, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

}