import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppModule } from '../app.module';
import { SignInComponent } from './signin.component';
import { UserService } from '../user/user.service';
import { User } from '../user/user';

let comp: SignInComponent;
let fixture: ComponentFixture<SignInComponent>;

describe('SignInComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule.withRoutes([]) ]
        }).overrideModule(AppModule, {
            remove: {
                providers: [
                    UserService
                ]
            },
            add: {
                providers: [
                    { provide: UserService, useClass: FakeUserService}
                ]
            }
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SignInComponent);
            comp = fixture.componentInstance;

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
            })
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('should have "Plask!" as title,', async(() => {
        fixture.whenStable().then(() => {
            expect(comp.title).toEqual('Plask!');
        });
    }));

    it('should have "Location-based live Q&A platform" as subtitle', async(() => {
        fixture.whenStable().then(() => {
        expect(comp.subtitle).toEqual('Location-based live Q&A platform');
        });
    }));

    it('should have a user variable instantiated', async(() => {
        fixture.whenStable().then(() => {
            expect(comp.user).not.toBeNull();
        });
    }));

    it('should successfully signin a proper user', async(() => {
        let spy = spyOn(comp, "goToMain");
        comp.user.email = 'swpp@gmail.com';
        comp.user.password = 'iluvswpp';
        comp.SignIn();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('can navigate to main', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToMain();
        expect(navigateSpy).toHaveBeenCalledWith(['/main']);
    }));

    it ('can navigate to signup', async(() =>{
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToSignUp();
        expect(navigateSpy).toHaveBeenCalledWith(['/signup']);
    }));

});

export const fakeUsers: User[] = [
    {email: 'swpp@gmail.com', password: 'iluvswpp', username: 'swpplover', locations: 'Korea/Seoul/Gwanak;', services: 'SNU;Cafe;', blockedServices: ';', notiFrequency: 10},
    {email: 'test1@gmail.com', password: 'test1', username: 'testuser1', locations: 'Korea/Seoul;', services: 'Music;Guitar;', blockedServices: ';', notiFrequency: 10},
];

class FakeUserService {
  signIn(user: User): Promise<number>{
      for(let i = 0; i < fakeUsers.length; ++i){
          if ((user.email == fakeUsers[i].email) && (user.password == fakeUsers[i].password)){
              return Promise.resolve<number>(204);
          }
      }
      return Promise.resolve<number>(403);
  }
}
