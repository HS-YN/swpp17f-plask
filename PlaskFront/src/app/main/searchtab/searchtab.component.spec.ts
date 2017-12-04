import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


import { SearchTabComponent } from './searchtab.component';
import { AppModule } from '../../app.module';
import { User } from '../../user/user';
import { Answer } from '../../answer/answer';
import { AnswerService } from '../../answer/answer.service';
import { Question } from '../../question/question';
import { QuestionService } from '../../question/question.service';



let comp: SearchTabComponent;
let fixture: ComponentFixture<SearchTabComponent>;

describe('SearchTabComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
        }).compileComponents().then(() => {
          fixture = TestBed.createComponent(SearchTabComponent);
          comp = fixture.componentInstance;
        });
    }));


    // Added during Sprint 4
    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it ('should trigger getAnswerList() when initiated', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(comp, "getAnswerList");

        comp.ngOnInit();
        tick();
        fixture.detectChanges();
        expect(comp.getAnswerList()).toHaveBeenCalled();

        expect(comp.expand).toThrow();
        expect(comp.answerClick).toThrow();
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

  it ('should work with getting question list after oninit', async(() => {
          comp.ngOnInit();
          fixture.whenStable().then(() => {
              expect(comp.temp_questionList).toEqual([Question[0], Question[1], Question[2]]);
          })
  }))


})


describe('SearchTabComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers:[
          QuestionService
        ]
      },
      add: {
        providers: [
          { provide: QuestionService, useClass: FakeQuestionService}
        ]
      }

    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SearchTabComponent);
      comp = fixture.componentInstance;

      let questionService = QuestionService;

      fixture.detectChanges();
      fixture.whenStable().then(() => {
          fixture.detectChanges();
      });

    });

  }));


});

export const fakeUser: User = {email: "swpp@snu.ac.kr", password: "iluvswpp", username: "swpplover",
    locations:"South Korea;", services:"Cafe;", blockedServices: "work;", notiFrequency: 1};

export const Questions: Question[] = [
    { id: 0, content: "aaa", author: "swpplover", locations:"South Korea;", services:"Cafe;"},
    { id: 1, content: "bbb", author: "Steve", locations:"South Korea/Seoul;", services:"Cafe;Coffee;"},
    { id: 2, content: "ccc", author: "swpplover", locations:"USA/Virginia;", services:"Karaoke;"},
    { id: 3, content: "ddd", author: "Maria", locations:"South Korea;USA/Virginia;", services:"Museum;Pub;"},
    { id: 4, content: "eee", author: "Katie", locations:"South Korea/Seoul/Gwanak;", services:"Cafe;"},
];
class FakeQuestionService {
  getQuestion(): Promise<Question[]>{
    let questions = Questions.filter(Questions => Questions.author === fakeUser.username);
    return Promise.resolve<Question[]>(questions);
  }

  getSearchedQuestion():Promise<Question[]>{
      let questions: Question[];
      questions.push(Question[0]);
      questions.push(Question[1]);
      questions.push(Question[2]); // Assuming the questions are in time order

      return Promise.resolve<Question[]>(questions);

  }

}
