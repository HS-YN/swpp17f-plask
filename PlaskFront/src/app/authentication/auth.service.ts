import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy } from '@angular/http';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthService {

    private checkSignedInUrl  = '/api/user/checksignedin';

    constructor(private http: Http) { }

    // 'True' if success, 'False' if failure
    isAuthenticated(): Promise<string>{
        return this.http.get(this.checkSignedInUrl).toPromise().then(response =>response.json() as string);
    }
}