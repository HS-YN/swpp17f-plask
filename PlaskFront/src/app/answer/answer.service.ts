import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Answer } from './answer';

@Injectable()
export class AnswerService{
    private answerUrl= '/api/ask/answer/';
    private tokenUrl = '/api/user/token';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    getAnswer(id: number): Promise<Answer[]>{
        const url = `${this.answerUrl}${id}`;
        return this.http.get(url)
            .toPromise()
            .then(Response => Response.json() as Answer[])
            .catch(this.handleError);
    }

    postAnswer(answer: string, id:number): Promise<number>{
        const url = `${this.answerUrl}${id}`;
        var headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(url, JSON.stringify({content : answer}), {headers: headers}).toPromise()
            .then(res => res.status)  // receive status code 201 if success,
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message);
    }
/*
    getCookie(name) {
        let value = ";" + document.cookie;
        let parts = value.split(";" + name + "=");
        if (parts.length ==2){
            return parts.pop().split(";").shift();
        }
    }
*/
}
