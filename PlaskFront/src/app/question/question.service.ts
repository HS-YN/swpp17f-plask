import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Question } from './question';

@Injectable()
export class QuestionService{
    private myQuestionUrl = '/api/ask/question';
    private relatedQuestionUrl = '/api/ask/question/related';
    private answeredQuestionUrl= '/api/ask/question/answer';
    private searchedQuestionUrl = '/api/ask/question/search';
    private selectAnswerUrl = '/api/ask/select';
    private tokenUrl = '/api/user/token';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }
     /* Get questions and answers for tab
      * 1: getRecent 2: getMyQ 3: getMyA
     */
    getQuestion(tab:number): Promise<Question[]>{
        let url:string;
        switch(tab){
            case 1: {
                url = this.relatedQuestionUrl;
                break;
            } case 2: {
                url = this.myQuestionUrl;
                break;
            } case 3: {
                url = this.answeredQuestionUrl;
                break;
            }
        }
        return this.http.get(url)
            .toPromise()
            .then(Response => Response.json() as Question[])
            .catch(this.handleError);
    }

    postQuestion(question: Question): Promise<number>{
        var headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.myQuestionUrl, JSON.stringify(question), {headers: headers}).toPromise()
            .then(res => res.status)  // receive status code 201 if success,
            .catch(this.handleError);
    }

    getSearchedQuestion(searchString: string, locCode: string[]): Promise<Question[]>{
        var headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.searchedQuestionUrl, JSON.stringify({
                loc_code1: locCode[0],
                loc_code2: locCode[1],
                loc_code3: locCode[2],
                search_string: searchString
            }), {headers: headers}).toPromise()
            .then(Response => Response.json() as Question)
            .catch(this.handleError);
    }

    selectAnswer(qid: number, aid: number): Promise<number>{
        const url = `${this.selectAnswerUrl}/${qid}/${aid}`;
        return this.http.get(url).toPromise()
            .then(res => res.status)  // receive status code 204 if success,
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
    }*/
}
