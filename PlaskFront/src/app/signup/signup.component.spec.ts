import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppModule } from '../app.module';
import { SignUpComponent } from './signup.component';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';

import { User } from '../user/user'; 
import { Location } from '../location/location';

let comp: SignUpComponent;
let fixture: ComponentFixture<SignUpComponent>;


describe('SignUpComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
        }).overrideModule(AppModule, { 
            remove: { 
                providers: [ 
                    UserService, LocationService 
                ] 
            },
            add: { 
                providers: [ 
                    { provide: LocationService, useClass: FakeLocationService }, 
                    { provide: UserService, useClass: FakeUserService }
                ] 
            }
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SignUpComponent);
            comp = fixture.componentInstance;

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
            });
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('should have its variable well instantiated', () => {
        expect(comp.selectedCountry).toEqual('');
        expect(comp.selectedProvince).toEqual('');
        expect(comp.selectedCity).toEqual('');
        expect(comp.newService).toEqual('');
        expect(comp.newBlockService).toEqual('');

        expect(comp.notiFrequencyList).toEqual([10, 20, 30, 60, 120]);
        expect(comp.selectedFreq).toEqual(10);
        
    })

    it('should properly update NotiFrequency', async(() => {
        comp.userNotiFrequencySelect(20);

        fixture.whenStable().then(() => {
            expect(comp.user.notiFrequency).toEqual(20);
        });
    }));

    it('should not accecpt email with more than 100 characters', async(() => {
        let spy = spyOn(window, "alert");
        comp.user.email = "thisisaemailwithmorethan100charactersthisisaemailwithmorethan100charactersthisisaemailwithmorethan100characters";
        comp.SignUp();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Invalid email address!");    
        });
    }));

    it('should not allow signup with no location tag', async(() => {
        let spy= spyOn(window, "alert");
        comp.user.email = "test@email.com";
        comp.user.password = "iluvswpp";
        comp.passwordConfirmation = "iluvswpp";
        comp.user.locations = "";
        comp.SignUp();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("You need to add at least one location!");
        });
    }));

    it('should not allow signup with no service tag', async(() => {
        let spy= spyOn(window, "alert");
        comp.user.email = "test@email.com";
        comp.user.password = "iluvswpp";
        comp.passwordConfirmation = "iluvswpp";
        comp.user.locations = "Korea;";
        comp.user.services = "";
        comp.SignUp();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("You need to add at least one service");
        });        
    }));

    it('shold successfully signup a user', async(() => {
        let spy= spyOn(window, "alert");
        let spy2 = spyOn(comp, "goBack");
        comp.user.email = "test@email.com";
        comp.user.password = "iluvswpp";
        comp.passwordConfirmation = "iluvswpp";
        comp.user.locations = "Korea;";
        comp.user.services = "music;";
        comp.SignUp();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Successfully signed up! Please sign in.");
            expect(spy2).toHaveBeenCalled();
        });
    }));

    it('can navigate to main', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToMain();
        expect(navigateSpy).toHaveBeenCalledWith(['/main']);
    }))

    it('can navigate to signout', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goBack();
        expect(navigateSpy).toHaveBeenCalledWith(['/signin']);
    }));

    it('should update notifrequency when onChange is called', async(() => {
        comp.onChange(20);

        fixture.whenStable().then(() => {
            expect(comp.user.notiFrequency).toEqual(20);
        })
    }))

    it('should properly refresh province list', async(() => {
        comp.provinceRefresh(1, "provinceList");

        fixture.whenStable().then(() => {
            expect(comp.provinceList).toEqual(fakeProvinceList);
        });
    }));
});

export const fakeCountryList: Location[] = [ 
    { loc_name: 'Korea', loc_code: 1 },
    { loc_name: 'Canada', loc_code: 2 },
    { loc_name: 'USA', loc_code: 3 },
];
export const fakeProvinceList: Location[] = [ 
    { loc_name: 'Seoul', loc_code: 4 },
    { loc_name: 'Jeju', loc_code: 5 }, 
    { loc_name: 'Daegu', loc_code: 6 },
];
export const fakeCityList: Location[] = [
    { loc_name: 'Gangnam', loc_code: 7 },
    { loc_name: 'Gwanak', loc_code: 8 },
    { loc_name: 'Seocho', loc_code: 9 }
];

class FakeLocationService {
    getCountryList(): Promise<Location[]> {
        return Promise.resolve<Location[]>(fakeCountryList);
    }

    getLocationList(location: string): Promise<Location[]> {
        if(location == "1" || location =="2" || location =="3"){
            return Promise.resolve<Location[]>(fakeProvinceList);            
        }
        else{
            return Promise.resolve<Location[]>(fakeCityList);
        }

    }    
}

export const fakeUsers: User[] = [
    {email: 'swpp@gmail.com', password: 'iluvswpp', username: 'swpplover', locations: 'Korea/Seoul/Gwanak;', services: 'SNU;Cafe;', blockedServices: ';', notiFrequency: 10},
    {email: 'test1@gmail.com', password: 'test1', username: 'testuser1', locations: 'Korea/Seoul;', services: 'Music;Guitar;', blockedServices: ';', notiFrequency: 10},
];
export const fakeServices: string[] = ['Music', 'Cafe', 'SWPP', 'SNU'];

class FakeUserService {
  signIn(user: User): Promise<number>{
      for(let i = 0; i < fakeUsers.length; ++i){
          if ((user.email == fakeUsers[i].email) && (user.password == fakeUsers[i].password)){
              return Promise.resolve<number>(204);
          }
      }
      return Promise.resolve<number>(403);
  }

  signUp(user: User): Promise<number> {
      return Promise.resolve<number>(201); // assume success :)
  }

  getService(): Promise<string[]> {
      return Promise.resolve<string[]>(fakeServices);
  }
}
