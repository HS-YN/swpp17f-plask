import { TestBed, ComponentFixture, async } from '@angular/core/testing';
//import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AutoCompleteComponent } from './autocomplete.component';
import { AppModule } from '../app.module';
import { ElementRef } from '@angular/core';

let comp: AutoCompleteComponent;
let fixture: ComponentFixture<AutoCompleteComponent>;

export class MockElementRef extends ElementRef{
    constructor(){ super(null)};
};


describe('AutoCompleteComponent', () => {
    let fixture: ComponentFixture<AutoCompleteComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule,  /*RouterTestingModule.withRoutes([])*/ ],
            declarations: [AutoCompleteComponent],
            providers: [
                {provide: ElementRef, useClass: MockElementRef},
            ],            
        }).compileComponents().then(() => {
 
          fixture = TestBed.createComponent(AutoCompleteComponent);
          comp = fixture.componentInstance;
        });
    });

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('can get function', () => {
        expect(comp.filter).toThrow();
        expect(comp.select).toThrow();
        expect(comp.handleClick).toThrow();
    })

    it('should return empty filteredlist if query is empty', async(() => {
        comp.query = '';
        comp.filter();

        fixture.whenStable().then (() => {
            expect(comp.filteredList).toEqual([]);            
        })

    }));

    it('should filter a raw list into a new filtered list', async(() => {
        comp.rawList = ["Hello", "Hi", "Bye", "ByeBye", "Home", "Here", "Hen"];
        comp.query = "He";
        comp.filter();

        fixture.whenStable().then(() => {
            expect(comp.filteredList).toEqual(["Hello", "Here", "Hen"]);
        })
    }))

    it('should trim down the filtered list into 10', async(() => {
        comp.rawList = ["abc", "acquire", "abroad", "abandon", "agony", "apple", "art", "ant", "announce", "append", "aero", "amend", "at"];
        comp.query="a";
        comp.filter();

        fixture.whenStable().then(() => {
            expect(comp.filteredList).toEqual(["abc", "acquire", "abroad", "abandon", "agony", "apple", "art", "ant", "announce", "append"]);
        })
    }))

    it('should select an item and empty the filteredlist', async(() => {
        comp.select("random item");

        fixture.whenStable().then(() => {
            expect(comp.query).toEqual("random item");
            expect(comp.filteredList).toEqual([]);
        })
    }))

})