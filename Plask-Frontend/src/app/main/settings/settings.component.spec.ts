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
            imports: [AppModule, RouterTestingModule]
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

});
