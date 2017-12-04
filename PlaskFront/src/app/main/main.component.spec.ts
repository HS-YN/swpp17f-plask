import { TestBed, ComponentFixture, async  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MainComponent } from './main.component';
import { AppModule } from '../app.module';

import { AutoCompleteComponent } from '../interface/autocomplete.component';

let comp: MainComponent;
let fixture: ComponentFixture<MainComponent>;
declare var Notification: any;

describe('MainComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
        }).compileComponents().then(() => {
          fixture = TestBed.createComponent(MainComponent);
          comp = fixture.componentInstance;
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('can get function', () => {
        expect(comp.gotoMainTab).toThrow();
        expect(comp.sendQuestion).toThrow();
        expect(comp.countryRefresh).toThrow();
        expect(comp.countrySelect).toThrow();
        expect(comp.provinceRefresh).toThrow();
        expect(comp.provinceSelect).toThrow();
        expect(comp.cityRefresh).toThrow();
        expect(comp.serviceRefresh).toThrow();
        expect(comp.questionServiceRefresh).toThrow();
        expect(comp.questionServiceSelect).toThrow();
        expect(comp.questionServiceDelete).toThrow();
        expect(comp.questionServiceAdd).toThrow();
        expect(comp.countrySearch).toThrow();
        expect(comp.searchProvinceRefresh).toThrow();
        expect(comp.provinceSearch).toThrow();
        expect(comp.searchCityRefresh).toThrow();
        expect(comp.search).toThrow();
        expect(comp.notify).toThrow();
        expect(comp.notifyWithPermission).toThrow();

    })

    it('can be initiated', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.ngOnInit();
        expect(navigateSpy).not.toHaveBeenCalledWith(['/signin']);
    }))

    it('can navigate to settings', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToSettings();
        expect(navigateSpy).toHaveBeenCalledWith(['/settings']);
    }))

    it('can navigate to signout', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        expect(comp.goSignOut).toThrow();
    }))

    it('can navigate to maintab', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigateByUrl');
        comp.gotoMainTab();
        expect(navigateSpy).toHaveBeenCalledWith("/main(tab:maintab;open=true)");

    }))

    it ('should display correct labels for input', async(() => {
        const labels = fixture.debugElement.queryAll(By.css('label'));
        const locationLabel = labels[0].nativeElement;
        const serviceLabel = labels[1].nativeElement;

        expect(locationLabel.textContent).toEqual("Location:");
        expect(serviceLabel.textContent).toEqual("Location"); // check again
    }))

    it('should trigger goToSettings() when the Settings button is clicked', async(() =>{
        spyOn(comp, 'goToSettings');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let settingsButton = btns[0].nativeElement;

        settingsButton.click();
        fixture.whenStable().then(() => {
            expect(comp.goToSettings).toHaveBeenCalled();
        });
    }));

    it('should trigger gosignOut() when the SignOut button is clicked', async(() => {
        spyOn(comp, 'goSignOut'); //method attached to the click.
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let signOutButton = btns[1].nativeElement;

        signOutButton.click();
        fixture.whenStable().then(() => {
            expect(comp.goSignOut).toHaveBeenCalled();            
        });
    }));

    // TODO: Need to change the test to properly test routerLink, not router.navigate
    it('should navigate to MainTab when the tab is clicked', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let mainTabButton = btns[2].nativeElement;

        mainTabButton.click();
        fixture.whenStable().then(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/main',{outlets: {'tab':['maintab']}}]);
        });
    }));

    it('should navigate to MyQuestionsTab when the tab is clicked', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let myQuestionsTabButton = btns[3].nativeElement;

        myQuestionsTabButton.click();
        fixture.whenStable().then(()=> {
            expect(navigateSpy).toHaveBeenCalledWith(['/main',{outlets: {'tab':['myquestions']}}]);    
        });        
    }));

    it('can navigate to MyAnswersTab when the tab is clicked', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let myAnswersTabButton = btns[4].nativeElement;

        myAnswersTabButton.click();
        fixture.whenStable().then(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/main',{outlets: {'tab':['myanswers']}}]);    
        });
    }));

    // Modified to aysnc from fakeAsync because fakeAsync cannot handle XHRs
    it ('should send alert message when trying send send empty quesiton', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.question.content = "";
        comp.sendQuestion();
 
        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Question is Empty!");
        });
    }));

    it('should send alert message if Question does not have a selected country', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.question.content = "test";
        comp.selectedCountry = "";
        comp.sendQuestion();
        
        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Please select country!");
        });
    }));

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

    it ('should properly get location by name', async(() => {
        var locationList: [{loc_name: "Korea", loc_code: 213}, {loc_name: "USA", loc_code: 216}];
        var result = comp.getLocationByName(locationList, "Korea");

        fixture.whenStable().then(() => {
            expect(result).toEqual({loc_name: "Korea", loc_code: 213});
        })
    }))
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

    // Need to be fixed
    it('should refresh service list when serviceRefresh() is called', async(() => {
        comp.serviceRefresh();
        
        fixture.whenStable().then(() => {
            expect(comp.serviceList).not.toBeNull();
        });
    }));

    it('should make questionServiceList null if question.services is ""', async(() => {
        comp.question.services ="";
        comp.questionServiceRefresh();
        fixture.whenStable().then(() => {
            expect(comp.questionServiceList).toBeNull();
        })
    }))

    it('should create questionServiceList after questionServiceRefresh() is performed', async(() => {
        comp.question.services ="cafe;music;";

        comp.questionServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.questionServiceList).toEqual(["cafe", "music"]);
        });
    }));

    it('should send alert message when trying to add an exsiting service tag', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.question.services="cafe;";
        comp.questionServiceSelect("cafe");

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag Already Added!");
        })
    }))

    it('should call questionServiceRefresh() when questionServiceSelect() is called', async(() => {
        let spy = spyOn(comp, "questionServiceRefresh");
        comp.questionServiceSelect("string");
        
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should create questionServiceList after questionServiceRefresh() is performed', async(() => {
        comp.question.services ="cafe;music;";

        comp.questionServiceRefresh();

        fixture.whenStable().then(() => {
            expect(comp.questionServiceList).toEqual(["cafe", "music"]);
        });
    }))

    it('should call questionServiceRefresh() when questionServiceDelete() is called', async(() => {
        let spy = spyOn(comp, "questionServiceRefresh");
        comp.questionServiceDelete("string");
        
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should delete a service tag when questionServiceDelete() is called', async(() => {
        comp.question.services="cafe;music;";
        comp.questionServiceDelete("cafe");

        fixture.whenStable().then(() => {
            expect(comp.question.services).toEqual("music;");
        })
    }))

    it('should send alert message when trying to add an empty service tag', async(() => {
        let windowSpy = spyOn(window, "alert");
        var servList: string[] = ["temp", "string"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, servList);
        comp.serviceAutoComplete.query = "";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag is Empty!");
        });
    }));

    it('should send alert message when trying to add a service tag with semicolon', async(() => {
        let windowSpy = spyOn(window, "alert");
        var servList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, servList);
        comp.serviceAutoComplete.query = "cafe;";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You cannot use SemiColon!");
        });
    }));

    it('should send alert message when trying to add a service tag with over 100 characters', async(() => {
        let windowSpy = spyOn(window, "alert");
        var servList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, servList);
        comp.serviceAutoComplete.query = "abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Tag length should be less than 100 characters.");
        });
    }));


    it('should call questionServiceSelect() when Add is called', async(() => {
        let spy = spyOn(comp, "questionServiceSelect");
        var servList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, servList);
        comp.serviceAutoComplete.query = "cafe";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should add a service tag when questionServiceAdd() is called', async(() => {
        comp.question.services ="music;";
        var servList: string[] = ["cafe", "music"];
        comp.serviceAutoComplete = new AutoCompleteComponent(fixture.elementRef, servList);
        comp.serviceAutoComplete.query = "cafe";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(comp.question.services).toEqual("music;cafe;");
        });
    }));

    it('should make searchProvinceList as null if "Nation" is selected in countrySearch', async(() => {
        var cityList: string[] = ["Seoul", "Busan"];

        comp.searchCityAutoComplete = new AutoCompleteComponent(fixture.elementRef, cityList);
        comp.countrySearch('Nation');

        fixture.whenStable().then(() => {
            expect(comp.searchProvinceList).toBeNull();
            expect(comp.searchCityNameList).toEqual([]);
            expect(comp.searchProvince).toEqual("");
            expect(comp.searchCity).toEqual("");
        })
    }));

    it('should call searchProvinceRefresh if a country is selected in countrySearch', async(() => {
        let spy = spyOn(comp, "searchProvinceRefresh");
        var cityList: string[] = ["Seoul", "Busan"];

        comp.searchCityAutoComplete = new AutoCompleteComponent(fixture.elementRef, cityList);
        comp.countrySearch('Korea');

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should work even if "Province" is selected in provinceSearch()', async(() => {
        var cityList: string[] = ["Seoul", "Busan"];

        comp.searchCityAutoComplete = new AutoCompleteComponent(fixture.elementRef, cityList);
        comp.provinceSearch('Province');

        fixture.whenStable().then(() => {
            expect(comp.searchCity).toEqual("");
            expect(comp.searchCityNameList).toEqual([]);
        })
    }));

    it('should call searchCityRefresh if a province is selected in provinceSearch', async(() => {
        let spy = spyOn(comp, "searchCityRefresh");
        var cityList: string[] = ["Seoul", "Busan"];

        comp.searchCityAutoComplete = new AutoCompleteComponent(fixture.elementRef, cityList);
        comp.provinceSearch('Seoul');

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should alert if serachString is empty', async(() => {
        let windowSpy = spyOn(window, "alert");
        comp.searchString = "";

        comp.search();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Please fill content before searching!");
        })
    }))

    it('should alert if autoComplete is invalid', async(() => {
       let windowSpy = spyOn(window, "alert");
       var cityList: string[] = ["Gwanak", "Gangnam"];
       comp.searchCityAutoComplete = new AutoCompleteComponent(fixture.elementRef, cityList);
       comp.searchCityAutoComplete.query = "Gwwannak";

       comp.search();

       fixture.whenStable().then(() => {
           expect(windowSpy).toHaveBeenCalledWith("Invalid city name.");
       })
    }))

    it('should ask for permission when permission is default', async(() => {    
        Notification.permission = "default";
        comp.notify("Plask!", "Hello!");

        fixture.whenStable().then(() => {
            expect(Notification.requestPermission()).toHaveBeenCalled();            
        })
    }))

    it('should send notification when permission is granted', async(() => {
        Notification.permission = "granted";
        comp.notifyWithPermission("Plask!", "Hello!");

        fixture.whenStable().then(() => {
            expect(setTimeout).toHaveBeenCalled();
        })
    }))


});
