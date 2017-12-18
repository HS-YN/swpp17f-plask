import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PageNotFoundComponent } from './pagenotfound.component';
import { AppModule } from '../app.module';

let comp: PageNotFoundComponent;
let fixture: ComponentFixture<PageNotFoundComponent>;

describe('PageNotFoundComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule ],
        }).compileComponents().then(() => {
          fixture = TestBed.createComponent(PageNotFoundComponent);
          comp = fixture.componentInstance;
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });
});
