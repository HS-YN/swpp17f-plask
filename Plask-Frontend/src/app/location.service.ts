import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LocationService{

    //List of Urls for API
    private locationUrl = '/api/location';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    getCountryList(): Promise<string[]> {
        return this.http.get(this.locationUrl).toPromise().then(
            response => response.json().data.substr(0, response.json().data.length-1)
            .split(';') as string[]).catch(this.handleError);
    }

    getLocationList(location: string): Promise<string[]>{
        const url = `${this.locationUrl}/${location}`;
        return this.http.get(url).toPromise().then(response =>
            response.json().data.substr(0, response.json().data.length-1)
            .split(';') as string[]).catch(this.handleError);
    }

    private handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

}
