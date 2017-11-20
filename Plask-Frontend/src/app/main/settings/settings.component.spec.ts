import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SettingsComponent } from './settings.component';
import { AppModule } from './app.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

let comp: SettingsComponent;
let fixture: ComponentFixture<SettingsComponent>;

describe('SettingsComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule.withRoutes([])]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SettingsComponent);
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

    it('can be initialized', () => {
        expect(comp.ngOnInit).toThrow();
    })

    // Added in Sprint 3
    it('should have its variable well defined', () => {
        expect(comp.newpassword).toBe('');
        expect(comp.passwordConfirmation).toBe('');
        expect(comp.selectedCountry).toBe('');
        expect(comp.selectedCity).toBe('');
        expect(comp.selectedProvince).toBe('');
        expect(comp.newService).toBe('');
    })

    it ('should display correct labels for input', async(() => {
        const labels = fixture.debugElement.queryAll(By.css('label'));
        const emailLabel = labels[0].nativeElement;
        const passwordLabel = labels[1].nativeElement;
        const passwordConfirmationLabel = labels[2].nativeElement;
        const usernameLabel = labels[3].nativeElement;
        const locationLabel = labels[4].nativeElement;
        const serviceLabel = labels[8].nativeElement;

        expect(emailLabel.classList.contains("Location:")).toBeTruthy();
        expect(passwordLabel.classList.contains("Services:")).toBeTruthy();
        expect(passwordLabel.classList.contains("Password:")).toBeTruthy();
        expect(passwordConfirmationLabel.classList.contains("Password Confirmation:")).toBeTruthy();
        expect(usernameLabel.classList.contains("Username:")).toBeTruthy();
        expect(locationLabel.classList.contains("Locations:")).toBeTruthy();
        expect(serviceLabel.classList.contains("Services:")).toBeTruthy();
    }))

    it ('should display "User Information" in the header', async(() => {
        const h3Headers = fixture.debugElement.queryAll(By.css('h3'));
        const header = h3Headers[0].nativeElement;

        expect(header.classList.contains("User Information")).toBeTruthy();
    }))

    it ('should display "Tags" in the subheader', async(() => {
        const h4Headers = fixture.debugElement.queryAll(By.css('h4'));
        const header = h4Headers[0].nativeElement;

        expect(header.classList.contains("Tags")).toBeTruthy();
    }))


    it('should be able to go back to Main Page', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToMain();
        expect(navigateSpy).toHaveBeenCalledWith(['/main']);
    }))



});
