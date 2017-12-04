import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';

import { UserService } from '../user/user.service'
import { LocationService } from '../location/location.service'
import { Location } from '../location/location';
import { SignUpComponent } from './signup.component';
import { AutoCompleteComponent } from '../interface/autocomplete.component';
import { AppModule } from '../app.module';

let comp: SignUpComponent;
let fixture: ComponentFixture<SignUpComponent>;

export class MockElementRef extends ElementRef{
    constructor(){ super(null)};
};

describe('SignUpComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
            providers: [
                {provide: ElementRef, useClass: MockElementRef},
            ],
        }).overrideModule(AppModule, { remove: { providers: [ LocationService ] },
                  add: { providers: [ { provide: LocationService, useClass: FakeLocationService } ] }
            }).compileComponents().then(() => {
          fixture = TestBed.createComponent(SignUpComponent);
          comp = fixture.componentInstance;
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('should have its variable well defined', () => {
        expect(comp.selectedCountry).toBe('');
        expect(comp.selectedCity).toBe('');
        expect(comp.selectedProvince).toBe('');
        expect(comp.newService).toBe('');
    })

    it('should have its functions well defined', () => {
        expect(comp.serviceRefresh).toThrow();
        expect(comp.countryRefresh).toThrow();
        expect(comp.provinceRefresh).toThrow();
        expect(comp.cityRefresh).toThrow();
        expect(comp.userServiceRefresh).toThrow();
        expect(comp.userServiceSelect).toThrow();
        expect(comp.userServiceDelete).toThrow();
        expect(comp.userServiceAdd).toThrow();
        expect(comp.userLocationRefresh).toThrow();
        expect(comp.userLocationAdd).toThrow();
        expect(comp.cityRefresh).toThrow();
        expect(comp.userLocationDelete).toThrow();
        expect(comp.countrySelect).toThrow();
        expect(comp.provinceSelect).toThrow();
        expect(comp.citySelect).toThrow();
        expect(comp.ValidatePassword).toThrow();
        expect(comp.SignUp).toThrow();
    })

    it('can be initialized', () => {
        comp.selectedCountry = "";
        expect(comp.ngOnInit).toThrow();
        comp.selectedCountry = "Seoul;";
        expect(comp.ngOnInit).toThrow();
        comp.selectedCountry = "Seoul";
        expect(comp.ngOnInit).not.toThrow;
    })

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
    }))


});

export const fakeLocationList: string[] = [ 'Seoul', 'Tokyo' ];

class FakeLocationService {
    getCountryList(): Promise<string> {
        return Promise.resolve<string>(fakeLocationList[0]);
    }

    getUserList(location: string): Promise<string> {
        return Promise.resolve<string>(fakeLocationList[1]);
    }
}
