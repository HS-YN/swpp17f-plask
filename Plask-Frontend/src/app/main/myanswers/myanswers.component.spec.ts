import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MyAnswersComponent } from './myanswers.component';
import { AppModule } from './app.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

let comp: MyAnswersComponent;
let fixture: ComponentFixture<MyAnswersComponent>;

describe('MyAnswersComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
        }).compileComponents().then(() => {
          fixture = TestBed.createComponent(MyAnswersComponent);
          comp = fixture.componentInstance;
        });
    }));

    // Added during Sprint 3
    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it ('should trigger getQuestionList() when initiated', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(comp, "getQuestionList");

        comp.ngOnInit();
        tick();
        fixture.detectChanges();
        expect(comp.getQuestionList()).toHaveBeenCalled();
    }))


    it('should not trigger expand() as there is no question', fakeAsync(() =>{
        fixture.detectChanges();
        spyOn(comp, 'expand');
        let divs = fixture.debugElement.queryAll(By.css('div'));
        let questionDiv = divs[3].nativeElement;
        let questionDivContent = questionDiv.textContent;

        questionDiv.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        expect(comp.expand(questionDivContent)).not.toHaveBeenCalled();
    }))

    it ('should display "Answer" as the button title', async(() => {
        const btns = fixture.debugElement.queryAll(By.css('button'));
        const btn = btns[0].nativeElement;

        expect(btn.classList.contains("Answer")).toBeTruthy();
    }))

})