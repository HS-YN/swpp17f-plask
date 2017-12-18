import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BlankComponent } from './blank.component';
import { AppModule } from '../app.module';

let comp: BlankComponent;
let fixture: ComponentFixture<BlankComponent>;

describe('BlankComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule ],
        }).compileComponents().then(() => {
          fixture = TestBed.createComponent(BlankComponent);
          comp = fixture.componentInstance;
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });
});
