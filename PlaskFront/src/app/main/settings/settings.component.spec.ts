import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppModule } from './../../app.module';
import { SettingsComponent } from './settings.component';
import { UserService } from '../../user/user.service';
import { LocationService } from '../../location/location.service';

import { User } from '../../user/user'; 
import { Location } from '../../location/location';

let comp: SettingsComponent;
let fixture: ComponentFixture<SettingsComponent>;

describe('SettingsComponent', () => {
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
            fixture = TestBed.createComponent(SettingsComponent);
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

    it('should have its variable well initialized', () => {
        expect(comp.newpassword).toEqual('');
        expect(comp.passwordConfirmation).toEqual('');
        expect(comp.selectedCountry).toEqual('');
        expect(comp.selectedProvince).toEqual('');
        expect(comp.selectedCity).toEqual('');        
        expect(comp.newService).toEqual('');
        expect(comp.newBlockService).toEqual('');
        expect(comp.notiFrequencyList).toEqual([10, 20, 30, 60, 120]);
    });

    it('should not save changes if password and confirmation is different', async(() => {
        let spy = spyOn(window, "alert");
        comp.newpassword = "pass";
        comp.passwordConfirmation = "fail";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Password is different.");
        });
    }));

    it('should not save changes if no location tag is selected', async(() => {
        let spy = spyOn(window, "alert");
        comp.newpassword= "pass";
        comp.passwordConfirmation = "pass";
        comp.user.locations = "";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("You need to have at least one location tag!");
        });
    }));

    it('should not save changes if no service tag is selected', async(() => {
        let spy = spyOn(window, "alert");
        comp.newpassword= "pass";
        comp.passwordConfirmation = "pass";
        comp.user.locations = "Korea;";
        comp.user.services = "";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("You need to have at least one service tag!");
        });
    }))

    it('should save changes with password update', async(() => {
        let spy = spyOn(window, "alert");
        let spy2 = spyOn(comp, "goToSignin");
        comp.newpassword= "pass";
        comp.passwordConfirmation = "pass";
        comp.user.locations = "Korea;";
        comp.user.services = "Music;";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Successfully changed password. Please sign in again.");
            expect(spy2).toHaveBeenCalled();
        });  
    }));

    it('should save changes without password update', async(() => {
        let spy = spyOn(window, "alert");
        let spy2 = spyOn(comp, "goToMain");
        comp.newpassword= "";
        comp.passwordConfirmation = "";
        comp.user.locations = "Korea;";
        comp.user.services = "Music;";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Successfully modified!");
            expect(spy2).toHaveBeenCalled();
        });  
    }));

    // Related to Routing
    it('should be able to go back to Main Page', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToMain();
        expect(navigateSpy).toHaveBeenCalledWith(['/main']);
    }))

    it('should be able to go back to SignIn Page', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToSignin();
        expect(navigateSpy).toHaveBeenCalledWith(['/signin']);
    }))

    it('should be able to goBack to Sign', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goBack();
        expect(navigateSpy).toHaveBeenCalledWith(['/signin']);       
    }))

    it('should properly update notiFrequency', async(() => {
        comp.onChange(20);

        fixture.whenStable().then(() => {
            expect(comp.user.notiFrequency).toEqual(20);
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

  getUser(): Promise<User> {
      return Promise.resolve<User>(fakeUsers[1]);
  }

  getService(): Promise<string[]> {
      return Promise.resolve<string[]>(fakeServices);
  }

  updateUser(user: User): Promise<User> {
      return Promise.resolve<User>(user);
  }
}

