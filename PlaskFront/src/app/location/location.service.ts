import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy } from '@angular/http';

import { Location } from './location';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LocationService{
    private countryUrl = '/api/location/countries'
    private locationUrl = '/api/location';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    getLocationByName (locList: Location[], name: string): Location {
        for (var i = 0; i < locList.length; i++) {
            if (name.localeCompare(locList[i].loc_name) === 0)
                return locList[i];
        }
        return null;
    }

    getCountryList(): Promise<Location[]> {
        return this.http.get(this.countryUrl)
            .toPromise()
            .then(response => response.json() as Location[])
            .catch(this.handleError);
    }

    getLocationList(location: string): Promise<Location[]> {
        const url = `${this.locationUrl}/${location}`;
        return this.http.get(url).toPromise()
            .then(response => response.json() as Location[])
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message);
    }
}/* istanbul ignore next */
