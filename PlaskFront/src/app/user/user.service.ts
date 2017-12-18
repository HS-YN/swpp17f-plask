import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';

@Injectable()
export class UserService{
    private signInUrl = '/api/user/signin';
    private signUpUrl = '/api/user/signup';
    private signOutUrl = '/api/user/signout';
    private userInfoUrl = '/api/user/userinfo';
    private checkSignedInUrl  = '/api/user/checksignedin';
    private serviceUrl = '/api/user/service';
    private tokenUrl = '/api/user/token';

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    signIn(user: User): Promise<number>{
        var headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(this.tokenUrl).toPromise().then(()=>
            headers.append('X-CSRFToken', this.getCookie('csrftoken')))
            .then(() =>  this.http.post(this.signInUrl, JSON.stringify(user),
                {headers: headers}).toPromise()
            .then(res => res.status))
            .catch(this.handleError);
    }

    signUp(user: User): Promise<number>{
        var headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(this.tokenUrl).toPromise().then(()=>
            headers.append('X-CSRFToken', this.getCookie('csrftoken')))
            .then(() => this.http.post(this.signUpUrl, JSON.stringify(user),
                {headers: headers}).toPromise()
            .then(res => res.status))
            .catch(this.handleError);
    }

    signOut(): Promise<number>{
        return this.http.get(this.signOutUrl).toPromise().then(response =>
            response.status).catch(this.handleError);
    }

    getUser(): Promise<User> {
        return this.http.get(this.userInfoUrl).toPromise().then(response =>
            response.json() as User).catch(this.handleError);
    }

    checkSignedIn(): Promise<string>{
        return this.http.get(this.checkSignedInUrl).toPromise().then(response =>
            response.json() as string).catch(this.handleError);
    }

    update(user: User): Promise<User>{
        var headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(this.tokenUrl).toPromise().then(()=>
            headers.append('X-CSRFToken', this.getCookie('csrftoken')))
            .then(() => this.http.put(this.userInfoUrl, JSON.stringify(user),
            {headers: headers}).toPromise().then(() => user))
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message);
    }

    getService(): Promise<string[]>{
        return this.http.get(this.serviceUrl)
            .toPromise()
            .then(response => response.json() as string[])
            .catch(this.handleError);
    }

    getCookie(name) {
        let value = ";" + document.cookie;
        let parts = value.split(";" + name + "=");
        if (parts.length ==2){
            return parts.pop().split(";").shift();
        }
    }

}/* istanbul ignore next */
