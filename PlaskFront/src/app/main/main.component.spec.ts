import { TestBed, ComponentFixture, async  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MainComponent } from './main.component';
import { AppModule } from '../app.module';

import { AutoCompleteComponent } from '../interface/autocomplete.component';

let comp: MainComponent;
let fixture: ComponentFixture<MainComponent>;

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
        expect(serviceLabel.textContent).toEqual("Label"); // check again
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
        comp.serviceTag ="cafe;";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("You cannot use SemiColon!");
        });
    }));

    it('should call questionServiceSelect() when Add is called', async(() => {
        let spy = spyOn(comp, "questionServiceSelect");
        comp.serviceTag = "cafe";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it('should add a service tag when questionServiceAdd() is called', async(() => {
        comp.question.services ="music;";
        comp.serviceTag = "cafe";
        comp.questionServiceAdd();

        fixture.whenStable().then(() => {
            expect(comp.question.services).toEqual("music;cafe;");
        });
    }));

});
