import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';


@Injectable()
export class UserService{

    //List of Urls for API
    private signInUrl = '/api/user/signin/'; //URL to signin
    private signUpUrl = '/api/user/signup/'; //URL to signup
    private signOutUrl = '/api/user/signout/';
    private userInfoUrl = '/api/user/userinfo';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    signIn(user: User): Promise<number>{
        return this.http
            .post(this.signInUrl, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as number)
            .catch(this.handleError);
    }

    signUp(user: User): Promise<number>{
        return this.http
            .post(this.signUpUrl, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as number)
            .catch(this.handleError);
    }

    signOut(): Promise<number>{
        return this.http.get(this.signOutUrl).toPromise().then(response =>
            response.json() as number).catch(this.handleError);
    }

    getUser(): Promise<User> {
        return this.http.get(this.userInfoUrl).toPromise().then(response =>
             response.json() as User).catch(this.handleError);
    }

    update(user: User): Promise<number>{
        return this.http.put(this.userInfoUrl, JSON.stringify(user),
            {headers: this.headers}).toPromise().then(() => user)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

}/* istanbul ignore next */
