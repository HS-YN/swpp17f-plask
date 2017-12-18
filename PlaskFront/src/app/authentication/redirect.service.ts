import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RedirectService implements CanActivate {

    constructor(public authService: AuthService, public router: Router){}

    canActivate(): Promise<boolean> {
        return this.authService.isAuthenticated()
        .then(response => {
            if(response == 'False'){
                return true;
            }
            else{
                this.router.navigate(['/main']);
                return false;
            }
        });
    }
}
