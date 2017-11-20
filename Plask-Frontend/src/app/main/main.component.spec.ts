import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MainComponent } from './main.component';
import { AppModule } from '../app.module';

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

    // Added in Sprint 3
    it ('should display correct labels for input', async(() => {
        const labels = fixture.debugElement.queryAll(By.css('label'));
        const locationLabel = labels[0].nativeElement;
        const serviceLabel = labels[1].nativeElement;

        expect(locationLabel.classList.contains("Location:")).toBeTruthy();
        expect(serviceLabel.classList.contains("Services:")).toBeTruthy();
    }))

    it('should trigger goToSettings() when the button is clicked', fakeAsync(() =>{
        fixture.detectChanges();
        spyOn(comp, 'goToSettings');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let settingsButton = btns[0].nativeElement;

        settingsButton.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        expect(comp.goToSettings()).toHaveBeenCalled();
    }))

    it('should trigger gosignOut() when the button is clicked', fakeAsync( () => {
        fixture.detectChanges();
        spyOn(comp, 'goSignOut'); //method attached to the click.
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let signOutButton = btns[1].nativeElement;

        signOutButton.triggerEventHandler('click', null);
        tick(); // simulates the passage of time until all pending asynchronous activities finish
        fixture.detectChanges();
        expect(comp.goSignOut()).toHaveBeenCalled();
    }));

    it('should navigate to MainTab when the tab is clicked', fakeAsync(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let mainTabButton = btns[2].nativeElement;

        mainTabButton.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/main',{outlets: {'tab':['maintab']}}]);
    }))

    it('should navigate to MyQuestionsTab when the tab is clicked', fakeAsync(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let myQuestionsTabButton = btns[3].nativeElement;

        myQuestionsTabButton.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/main',{outlets: {'tab':['myquestions']}}]);
    }))

    it('can navigate to MyAnswersTab when the tab is clicked', fakeAsync(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        let btns = fixture.debugElement.queryAll(By.css('button'));
        let myAnswersTabButton = btns[4].nativeElement;

        myAnswersTabButton.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/main',{outlets: {'tab':['myanswers']}}]);
    }))

    it ('should receive alert message when question is empty', fakeAsync(() => {
        let windowSpy = spyOn(window, "alert");

        comp.question.content = "";
        comp.sendQuestion();
        tick();
        fixture.detectChanges();
        expect(windowSpy).toHaveBeenCalledWith("Question is Empty!");
    }));

    it('should alert message if selectedCountry is empty', fakeAsync(() => {
        let windowSpy = spyOn(window, "alert");

        comp.question.content = "test";
        comp.selectedCountry = "";
        comp.sendQuestion();
        tick();
        fixture.detectChanges();
        expect(windowSpy).toHaveBeenCalledWith("Please select country!");
    }))

    it('should update selectedCountry when it is selected', fakeAsync(() => {
        comp.countrySelect("Korea");
        tick();
        fixture.detectChanges();
        expect(comp.selectedCountry).toEqual("Korea");
    }))

    it('should update selectedProvince when it is selected', fakeAsync(() => {
        comp.provinceSelect("Seoul");
        tick();
        fixture.detectChanges();
        expect(comp.selectedProvince).toEqual("Seoul");
    }))

    it('should refresh service list when refresh is called', fakeAsync(() => {
        comp.serviceRefresh();
        tick();
        fixture.detectChanges();
        expect(comp.serviceList).not.toBeNull();
    }))

    it('should call questionService Refresh when Delete is called', fakeAsync(() => {
        let spy = spyOn(comp, "questionServiceRefresh");

        comp.questionServiceDelete("string")
        tick();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    }))

    it('should call questionServiceSelect() when Add is called', fakeAsync(() => {
        let spy = spyOn(comp, "questionServiceSelect");

        comp.questionServiceAdd();
        tick();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    }))



});
