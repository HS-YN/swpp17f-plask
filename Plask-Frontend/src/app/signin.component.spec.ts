import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SignInComponent } from './signin.component';
import { AppModule } from './app.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { User } from './user';
import { UserService } from './user.service';

let comp: SignInComponent;
let fixture: ComponentFixture<SignInComponent>;

describe('SignInComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule]
        }).overrideModule(AppModule, {
            remove: {
                providers: [
                   UserService
                ]
            },
            add: {
                providers:[
                {provide: UserService, useClass: FakeUserService}
                ]
            }
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SignInComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('should have as title Plask!', async(()=> {
        expect(comp.title).toEqual('Plask!');
    }));

    it('should have as subtitle Location-based live Q&A platform', async(() => {
        expect(comp.subtitle).toEqual('Location-based live Q&A platform');
    }));

    it('should have user notificaiton frequency set to 1 as default', async(() => {
        expect(comp.user.notiFrequency).toEqual(1);
    }));


 //   it('should have Email: as the first label', async(() => {
 //       let label = fixture.debugElement.queryAll(By.css('label')).map(de => de.nativeElement);
  //      expect(label[0]).not.toBeNull();
  //  }))



});

//export const fakeUsers: User[] = [
//    {email: 'swpp@snu.ac.kr', password: 'iluvswpp', username: 'SWPPlover', locations: '', services: '', blockedServices: '', notiFrequency: 1},
 //   {email: 'swpp2@snu.ac.kr', password: 'iluvswpp!', username:'SWPPliker', locations: '', services: '', blockedServices: '', notiFrequency: 1},
//
//];

class FakeUserService{

}
