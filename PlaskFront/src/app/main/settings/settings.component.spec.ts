import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SettingsComponent } from './settings.component';
import { AppModule } from './../../app.module';

let comp: SettingsComponent;
let fixture: ComponentFixture<SettingsComponent>;

describe('SettingsComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule.withRoutes([])]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SettingsComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('can be initialized', () => {
        expect(comp.ngOnInit).toThrow();
    })

    it('should have its variable well defined', () => {
        expect(comp.newpassword).toEqual('');
        expect(comp.passwordConfirmation).toEqual('');
        expect(comp.selectedCountry).toEqual('');
        expect(comp.selectedProvince).toEqual('');
        expect(comp.selectedCity).toEqual('');        
        expect(comp.newService).toEqual('');
        expect(comp.newBlockService).toEqual('');
    })

    it ('should display correct labels for input', async(() => {
        const labels = fixture.debugElement.queryAll(By.css('label'));
        const emailLabel = labels[0].nativeElement;
        const passwordLabel = labels[1].nativeElement;
        const passwordConfirmationLabel = labels[2].nativeElement;
        const usernameLabel = labels[3].nativeElement;
        const locationLabel = labels[4].nativeElement;
        const serviceLabel = labels[8].nativeElement;

        expect(emailLabel.textContent).toEqual("Location:");
        expect(passwordLabel.textContent).toEqual("Services:");
        expect(passwordLabel.textContent).toEqual("Password:");
        expect(passwordConfirmationLabel.textContent).toEqual("Password Coirmation:");
        expect(usernameLabel.textContent).toEqual("Username:");
        expect(locationLabel.textContent).toEqual("Locations:");
        expect(serviceLabel.textContent).toEqual("Services:");
    }))

    it ('should display "User Information" in the header', async(() => {
        const h3Headers = fixture.debugElement.queryAll(By.css('h3'));
        const header = h3Headers[0].nativeElement;

        expect(header.textContent).toEqual("User Information");
    }))

    it ('should display "Tags" in the subheader', async(() => {
        const h4Headers = fixture.debugElement.queryAll(By.css('h4'));
        const header = h4Headers[0].nativeElement;

        expect(header.textContent).toEqual("Tags");
    }))

    it('should send alert message if new password does not match password confirmation', async(() => {
        let windowSpy = spyOn(window, "alert");
        comp.newpassword = "newpassowrd";
        comp.passwordConfirmation = "wrongpassword";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Password is different.");
        });
    }));

    it('should send alert message if password has successfully been changed', async(() => {
        let windowSpy = spyOn(window, "alert");
        comp.newpassword = "newpassword";
        comp.passwordConfirmation = "newpassword";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Successfully changed password. Please sign in again.");
        });
    }));

    it('should send alert message if change has been made in settings', async(() => {
        let windowSpy = spyOn(window, "alert");
        comp.newpassword = "";
        comp.passwordConfirmation = "";
        comp.SaveChanges();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Successfully modified!");
        });
    }));

    it('should return null to userLocationList if user.locations is ""', async(() => {
        comp.user.locations ="";
        comp.userLocationRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userLocationList).toBeNull();
        });
    }));

    it('should create a userLocationList if user.locations exists', async(() => {
        comp.user.locations="USA;Korea/Seoul/Gwanak;";
        comp.userLocationRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userLocationList).toEqual(["USA", "Korea/Seoul/Gwanak"]);
        });
    }));

    it('should send alert message if adding an empty location tag', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.selectedCountry = "";
        comp.userLocationAdd();
        
        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Please select country!");
        });
    }));

    it('should send alert message if adding the same location tag twice', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.selectedCountry = "Korea";
        comp.selectedProvince = "";
        comp.selectedCity = "";
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
        comp.selectedCity = "Gwanak";

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

    it('should call userLocationRefresh() when userLocationAdd() is performed', async(() => {
        let spy = spyOn(comp, "userLocationRefresh");
        comp.user.locations = "USA;";
        comp.selectedCountry = "Korea";
        comp.selectedProvince ="Seoul";
        comp.selectedCity = "Gwanak";

        comp.userLocationAdd();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        })        
    }))

    it('should delete a specific location tag when userLocationDelete() is called', async(() => {
        comp.user.locations = "USA;Korea/Seoul/Gwanak;";
        comp.userLocationDelete("USA");

        fixture.whenStable().then(() => {
            expect(comp.user.locations).toEqual("Korea/Seoul/Gwanak;");
            expect(comp.userLocationList).toEqual(["Korea/Seoul/Gwanak"]);
        })
    }))

    it('should update selectedCountry when a country selected', async(() => {
        comp.countrySelect("Korea");
        
        fixture.whenStable().then(() => {
            expect(comp.selectedCountry).toEqual("Korea");
        });
    }));

    it('should call provinceRefesh when a countrySelect() is called', async(() => {
        let spy = spyOn(comp, "provinceRefresh");
        comp.countrySelect("Korea");

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should update selectedProvince when a province selected', async(() => {
        comp.provinceSelect("Seoul");
        
        fixture.whenStable().then(() => {
            expect(comp.selectedProvince).toEqual("Seoul");    
        });
    }));

    it('should call cityRefresh when a provinceSelect() is called', async(() => {
        let spy = spyOn(comp, "cityRefresh");
        comp.provinceSelect("Seoul");

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should update selectedCity when a city is selected', async(() => {
        comp.citySelect("Gwanak");

        fixture.whenStable().then(() => {
            expect(comp.selectedCity).toEqual("Gwanak");
        })
    }))

    // Related to adding userService
    it('should refresh service list when serviceRefresh() is called', async(() => {
        comp.serviceRefresh();
        
        fixture.whenStable().then(() => {
            expect(comp.serviceList).not.toBeNull();
        });
    }));

    it('should make userServiceList empty if user.services is ""', async(() => {
        comp.user.services ="";
        comp.userServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userServiceList).toEqual([]);
        });
    }));

    it('should make userServiceList when userServiceRefresh() is called', async(() => {
        comp.user.services="cafe;music;";
        comp.userServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.userServiceList).toEqual(["cafe", "music"]);
        });
    }));

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
        let windowSpy = spyOn(window, "alert");
        comp.newService ="";
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag is Empty!");
        });
    }));

    it('should send alert message when trying to add a service tag with semicolon', async(() => {
        let windowSpy = spyOn(window, "alert");
        comp.newService ="cafe;";
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
        let spy = spyOn(comp, "userServiceSelect");
        comp.newService ="cafe";
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should add a service tag when userServiceAdd() is called', async(() => {
        comp.user.services ="music;";
        comp.newService = "cafe";
        comp.userServiceAdd();

        fixture.whenStable().then(() => {
            expect(comp.user.services).toEqual("music;cafe;");
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
        let windowSpy = spyOn(window, "alert");
        comp.newBlockService ="";
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag is Empty!");
        });
    }));

    it('should send alert message when trying to add a blocked service tag with semicolon', async(() => {
        let windowSpy = spyOn(window, "alert");
        comp.newBlockService ="cafe;";
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You cannot use SemiColon!");
        });
    }));

    it('should send alert message when trying to add a blocked service tag which already exists in the selected service list', async(() =>{
        let windowSpy = spyOn(window, "alert");
        comp.userServiceList = ["cafe", "music"];
        comp.newBlockService ="cafe";
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You cannot set same tags on Services and Blocked Services");
        })
    }))

    it('should send alert message when trying to add a blocked service tag which already exists in the blocked list', async(() =>{
        let windowSpy = spyOn(window, "alert");
        comp.userBlockedServiceList = ["cafe", "music"];
        comp.newBlockService ="cafe";
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag already Exists!");
        })
    }))

    it('should add a blocked service tag when userBlockedServiceAdd() is called', async(() => {
        comp.user.blockedServices ="music;";
        comp.newBlockService = "cafe";
        comp.userBlockedServiceAdd();

        fixture.whenStable().then(() => {
            expect(comp.user.blockedServices).toEqual("music;cafe;");
        });
    }));

    it('should update notiFrequency when onChange() is called', async(() => {
        comp.onChange(3);

        fixture.whenStable().then(() => {
            expect(comp.user.notiFrequency).toEqual(3);
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
});