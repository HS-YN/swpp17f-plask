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

//import { AutoCompleteComponent } from '../interface/autocomplete.component';

let comp: SignUpComponent;
let fixture: ComponentFixture<SignUpComponent>;

/*export class MockElementRef extends ElementRef{
    constructor(){ super(null)};
};*/

describe('SignUpComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
            /*providers: [
                {provide: ElementRef, useClass: MockElementRef},
            ],*/
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

/*    it('should properly refresh province list', async(() => {
        comp.provinceRefresh()
    }))

    it('should set userLocationList as null when user.locations is empty', async (() => {
        comp.user.locations = "";
        comp.userLocationRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userLocationList).toBeNull;
        })
    }))

    it('should set userLocationList when userLocationRefresh is called', async (() => {
        comp.user.locations ="Korea/Seoul;USA/Florida/Orlando;";
        comp.userLocationRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userLocationList).toEqual(["Korea/Seoul", "USA/Florida/Orlando"]);
        })
    }))

    it('should send alert message if adding an empty location tag', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.selectedCountry = "";
        comp.userLocationAdd();
        
        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Please select country!");
        });
    }));

    it('should send alert message if adding the same location tag twice', async(() => {
        var ctList: string[] = ["Gwanak", "Gangnam"];
        comp.cityAutoComplete = new AutoCompleteComponent(fixture.elementRef, ctList);
        let windowSpy = spyOn(window, "alert");

        comp.selectedCountry = "Korea";
        comp.selectedProvince = "";
        comp.user.locations = "Korea;";

        comp.userLocationAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You've already selected Korea !");
        });
    }));

    it('should properly add new location tag to the location tag list', async(() => {
        
        comp.user.locations = "USA;";
        comp.selectedCountry = "Korea";
        comp.selectedProvince ="Seoul";
        var cityList: string[] = ["Gwanak" ,"Nakseongdae"];
        comp.cityAutoComplete = new AutoCompleteComponent(fixture.elementRef, cityList);
        comp.cityAutoComplete.query = "Gwanak";

        comp.userLocationAdd();

        fixture.whenStable().then(() => {
            expect(comp.user.locations).toEqual("USA;Korea/Seoul/Gwanak;");
            expect(comp.selectedCountry).toEqual("");
            expect(comp.selectedProvince).toEqual("");
            expect(comp.selectedCity).toEqual("");
            expect(comp.provinceList).toBeNull();
            expect(comp.cityList).toBeNull();
        });
    }));

    it('should delete a location when userLocationDelete is called', async (() => {
        let spy = spyOn(comp, "userLocationRefresh");
        comp.user.locations="Korea/Seoul;USA/Florida/Orlando;";
        comp.userLocationDelete("Korea/Seoul");

        fixture.whenStable().then(() => {
            expect(comp.user.locations).toEqual("USA/Florida/Orlando;");
            expect(spy).toHaveBeenCalled();
        })
    }))

    it ('should properly get location by name', async(() => {
        var locationList: [{loc_name: "Korea", loc_code: 213}, {loc_name: "USA", loc_code: 216}];
        var result = comp.getLocationByName(locationList, "Korea");

        fixture.whenStable().then(() => {
            expect(result).toEqual({loc_name: "Korea", loc_code: 213});
        })
    }))

    it('should update selectedCountry when it is selected', async(() => {
        let spy = spyOn(comp, "provinceRefresh");
        comp.countrySelect("Korea");
        
        fixture.whenStable().then(() => {
            expect(comp.selectedCountry).toEqual("Korea");
            expect(spy).toHaveBeenCalled();
        })
    }));

    it('should update selectedProvince when it is selected', async(() => {
        let spy = spyOn(comp, "cityRefresh");
        comp.provinceSelect("Seoul");
        
        fixture.whenStable().then(() => {
            expect(comp.selectedProvince).toEqual("Seoul");
            expect(spy).toHaveBeenCalled();
        })
    }))

    it('should update selectedCity when it is selected', async(() => {
        var ctList: string[] = ["Gwanak", "Gangnam"];
        comp.cityAutoComplete = new AutoCompleteComponent(fixture.elementRef, ctList);
        comp.cityAutoComplete.query = "Gwanak";
        comp.citySelect();
        
        fixture.whenStable().then(() => {
            expect(comp.selectedCity).toEqual("Gwanak");
        })
    }))


    it('should create empty userService list if user.services is empty', async(() => {
        this.user.services ='';
        comp.userServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userServiceList).toEqual([]);
        })
    }))

    it('should create a userService list if user.servcices exists', async (() => {
        this.user.services='cafe;music;';
        comp.userServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userServiceList).toEqual(['cafe', 'music']);
        })
    }))

    it('should send alert message when trying to add an exsiting service tag', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.user.services="cafe;";
        comp.userServiceSelect("cafe");

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag Already Added!");
        })
    }))


    it('should call userServiceRefresh() when userServiceDelete() is called', async(() => {
        let spy = spyOn(comp, "userServiceRefresh");
        comp.userServiceDelete("string");
        
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should delete a given service tag from user.services when userServiceDelete() is performed', async(() => {
        comp.user.services ="cafe;music;";
        comp.userServiceDelete("cafe");

        fixture.whenStable().then(() => {
            expect(comp.user.services).toEqual("music;");
        });
    }));

    it('should send alert message when trying to add an empty service tag', async(() => {
        var svList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, svList);
        comp.serviceAutoComplete.query = "";
        let windowSpy = spyOn(window, "alert");
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag is Empty!");
        });
    }));

    it('should send alert message when trying to add a service tag with semicolon', async(() => {
        var svList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, svList);
        comp.serviceAutoComplete.query = "cafe;"
        let windowSpy = spyOn(window, "alert");
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You cannot use SemiColon!");
        });
    }));

    it('should send alert message when trying to add a custom service tag which already exists in the (recommended) list', async(() =>{
        let windowSpy = spyOn(window, "alert");
        comp.serviceList = ["Cafe", "music"];
        comp.newService ="cafe";
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag already Exists!");
        })
    }))

    it('should call userServiceSelect() when Add is called', async(() => {
        var svList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, svList);
        comp.serviceAutoComplete.query = "cafe"
        let spy = spyOn(comp, "userServiceSelect");
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should add a service tag when userServiceAdd() is called', async(() => {
        var svList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, svList);
        comp.serviceAutoComplete.query = "cafe"
        comp.user.services ="music;";
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(comp.user.services).toEqual("music;cafe;");
            expect(comp.newService).toEqual("");
            expect(comp.serviceAutoComplete.query).toEqual("");
        });
    }));

    // Related to adding blockedService
    it('should make userBlockedServiceList empty if user.blockedServices is ""', async(() => {
        comp.user.blockedServices ="";
        comp.userBlockedServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userBlockedServiceList).toEqual([]);
        });
    }));

    it('should make userBlockedServiceList when userBlockedServiceRefresh() is called', async(() => {
        comp.user.blockedServices="cafe;music;";
        comp.userBlockedServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userBlockedServiceList).toEqual(["cafe", "music"]);
        });
    }));

    it('should call userBlockedServiceRefresh() when userBlockedServiceDelete() is called', async(() => {
        let spy = spyOn(comp, "userBlockedServiceRefresh");
        comp.userBlockedServiceDelete("string");
        
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should delete a given service tag from user.blockedServices when userBlockedServiceDelete() is performed', async(() => {
        comp.user.blockedServices ="cafe;music;";
        comp.userBlockedServiceDelete("cafe");

        fixture.whenStable().then(() => {
            expect(comp.user.blockedServices).toEqual("music;");
        });
    }));

    it('should send alert message when trying to add an empty blocked service tag', async(() => {
        var bsvList: string[] = ["music", "cafe"];
        comp.blockAutoComplete = new AutoCompleteComponent(fixture.elementRef, bsvList);
        comp.blockAutoComplete.query = "";
        let windowSpy = spyOn(window, "alert");
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag is Empty!");
        });
    }));

    it('should send alert message when trying to add a blocked service tag with semicolon', async(() => {
        var bsvList: string[] = ["music", "cafe"];
        comp.blockAutoComplete = new AutoCompleteComponent(fixture.elementRef, bsvList);
        comp.blockAutoComplete.query = "cafe;";
        let windowSpy = spyOn(window, "alert");
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You cannot use SemiColon!");
        });
    }));

    it('should send alert message when trying to add a blocked service tag which already exists in the selected service list', async(() =>{
        var bsvList: string[] = ["music", "cafe"];
        comp.blockAutoComplete = new AutoCompleteComponent(fixture.elementRef, bsvList);
        comp.blockAutoComplete.query = "cafe";
        let windowSpy = spyOn(window, "alert");
        comp.userServiceList = ["cafe", "music"];
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You cannot set same tags on Services and Blocked Services");
        })
    }))

    it('should send alert message when trying to add a blocked service tag which already exists in the blocked list', async(() =>{
        var bsvList: string[] = ["music", "cafe"];
        comp.blockAutoComplete = new AutoCompleteComponent(fixture.elementRef, bsvList);
        comp.blockAutoComplete.query = "cafe";
        let windowSpy = spyOn(window, "alert");
        comp.userBlockedServiceList = ["cafe", "music"];
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag already Exists!");
        })
    }))

    it('should add a blocked service tag when userBlockedServiceAdd() is called', async(() => {
        var bsvList: string[] = ["music", "cafe"];
        comp.blockAutoComplete = new AutoCompleteComponent(fixture.elementRef, bsvList);
        comp.blockAutoComplete.query = "cafe";
        comp.user.blockedServices ="music;";
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(comp.user.blockedServices).toEqual("music;cafe;");
            expect(comp.newBlockService).toEqual("");
            expect(comp.blockAutoComplete.query).toEqual("");
        });
    }));

    it('should properly select NotiFrequency', async(() => {
        comp.userNotiFrequencySelect(3);

        fixture.whenStable().then(() => {
            expect(comp.user.notiFrequency).toEqual(3);
        })
    }))


    it('should change notiFrequency', async(() => {
        comp.onChange(3);

        fixture.whenStable().then(() => {
        expect(comp.user.notiFrequency).toEqual(3);            
        })
    }))*/


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

    /*getLocationList(country_code: number, provinceList: string): Promise<Location[]> {
        return 
    }*/

   /* getUserList(location: string): Promise<string> {
        return Promise.resolve<string>(fakeLocationList[1]);
    }*/
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
