import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Question } from './question';


@Injectable()
export class QuestionService{


    // list of Urls for API
    private questionUrl = '/api/ask/question'; // receive user's question and POST question
    private recentQuestionUrl = '/api/ask/question/recent'; // receive recent question
    private relatedQuestionUrl = '/api/ask/question/related'; // receive related question
    private answeredQuestionUrl= '/api/ask/question/answer'; // receive user's answered question
    private searchedQuestionUrl = '/api/ask/question/search';
    private tokenUrl = '/api/user/token';

    private headers = new Headers({'Content-Type': 'application/json'});


    constructor(private http: Http) { }

    // GET the question list of a user (list of questions asked by the user)
    getQuestion(): Promise<Question[]>{
        return this.http.get(this.questionUrl)
            .toPromise()
            .then(Response => Response.json() as Question[])
            .catch(this.handleError);

    }

    postQuestion(question: Question): Promise<number>{
        var headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.questionUrl, JSON.stringify(question), {headers: headers}).toPromise()
            .then(res => res.status)  // receive status code 201 if success,
            .catch(this.handleError);
    }

    getRecentQuestion(): Promise<Question[]>{
        return this.http.get(this.recentQuestionUrl)
            .toPromise()
            .then(Response => Response.json() as Question[])
            .catch(this.handleError);
    }


    getRelatedQuestion(): Promise<Question[]>{
        return this.http.get(this.relatedQuestionUrl)
            .toPromise()
            .then(Response => Response.json() as Question[])
            .catch(this.handleError);
    }

    getAnsweredQuestion(): Promise<Question[]>{
        return this.http.get(this.answeredQuestionUrl)
            .toPromise()
            .then(Response => Response.json() as Question[])
            .catch(this.handleError);
    }

    getSearchedQuestion(searchString: string, locCode: Number[]): Promise<Question[]>{
        if(locCode[2]!=null) // country/province/city
            this.searchedQuestionUrl = this.searchedQuestionUrl + "/" + locCode[0].toString() + 
            "/" + locCode[1].toString() + "/" + locCode[2].toString() + "/" + searchString;
        else if(locCode[1] != null) // country/province
            this.searchedQuestionUrl = this.searchedQuestionUrl + "/" + locCode[0].toString() + 
            "/" + locCode[1].toString() + "/" + searchString;
        else //country
            this.searchedQuestionUrl = this.searchedQuestionUrl + "/" + locCode[0].toString() + "/" + searchString;

        return this.http.get(this.searchedQuestionUrl)
            .toPromise()
            .then(Response => Response.json() as Question[])
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message);
    }

    getCookie(name) {
        let value = ";" + document.cookie;
        let parts = value.split(";" + name + "=");
        if (parts.length ==2){
            return parts.pop().split(";").shift();
        }
    }

}
