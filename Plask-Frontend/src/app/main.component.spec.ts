import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MainComponent } from './main.component';
import { AppModule } from './app.module';

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
});
