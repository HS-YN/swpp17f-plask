import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { UserService } from '../user/user.service'
import { LocationService } from '../location/location.service'
import { SignUpComponent } from './signup.component';
import { AppModule } from '../app.module';

let comp: SignUpComponent;
let fixture: ComponentFixture<SignUpComponent>;

describe('SignUpComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
        }).overrideModule(AppModule, { remove: { providers: [ LocationService ] },
                  add: { providers: [ { provide: LocationService, useClass: FakeLocationService } ] }
            }).compileComponents().then(() => {
          fixture = TestBed.createComponent(SignUpComponent);
          comp = fixture.componentInstance;
          fixture.detectChanges();
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

    it('should update selectedCity when it is selected', fakeAsync(() => {
        comp.citySelect("Gwanak");
        tick();
        fixture.detectChanges();
        expect(comp.selectedProvince).toEqual("Gwanak");
    }))


    it('should refresh service list when refresh is called', fakeAsync(() => {
        comp.serviceRefresh();
        tick();
        fixture.detectChanges();
        expect(comp.serviceList).not.toBeNull();
    }))

    it('should call refreash when add is called', fakeAsync(()=> {
        let spy = spyOn(comp, "userLocationRefresh");

        comp.userLocationAdd();
        tick();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    }));

    it('should call refreash when delete is called', fakeAsync(()=> {
        let spy = spyOn(comp, "userLocationRefresh");

        comp.userLocationDelete("string");
        tick();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    }));


    it('should change notiFrequency', fakeAsync(() => {
        comp.onChange(3);
        tick();
        fixture.detectChanges();
        expect(comp.user.notiFrequency).toEqual(3);
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
