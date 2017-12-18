import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Question } from './question';
import { QuestionService } from './question.service';

const questionListData = [
    { id: 1, content: 'test input1', author: 'John', locations: 'Korea;',
      services: 'Travel;'},
    { id: 2, content: 'test input 2', author: 'Isabel',
      locations: 'Seoul;Korea;', services: 'Music;'},
] as Question[];

const questionData = { id: 3, content: 'test input 3', author: 'Tim',
    locations: 'Japan;', services: 'Travel;Music;'} as Question;

describe('QuestionService (mockBackend)', () => {
      beforeEach( async(() => {
        TestBed.configureTestingModule({
              imports: [ HttpModule ],
              providers: [QuestionService, { provide: XHRBackend, useClass: MockBackend }]
        }).compileComponents();
      }));

      it('can instantiate service when injected',
        inject([QuestionService], (service: QuestionService) => {
          expect(service instanceof QuestionService).toBe(true);
      }));

      it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new QuestionService(http);
      expect(service instanceof QuestionService).toBe(true, 'new service should be ok');
      }));

      it('can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
          expect(backend).not.toBeNull('backend should be provided');
      }));

    describe('when instantiating question', () => {
        it('shoule have default values', () => {
            let question: Question = new Question;
            expect(question.content).toBe('');
            expect(question.author).toBe('');
            expect(question.locations).toBe(';');
            expect(question.services).toBe(';');
        })
    })

    describe('when modifying Question', () => {
        let backend: MockBackend;
        let service: QuestionService;
        let fakeData: Question;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new QuestionService(http);
            fakeData = questionData;
            response = new Response(new ResponseOptions({status: 200, body: {data: questionListData}}));
        }));

        it('can get Related Question List', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getQuestion(1).then(Questions => {
                expect(Questions['data'].length).toBeLessThan(10);
            });
        }));

        it('can get My Question List', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getQuestion(2).then(Questions => {
                expect(Questions['data'].length).toBeLessThan(10);
            });
        }));

        it('can get Answered Question List', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getQuestion(3).then(Questions => {
                expect(Questions['data'].length).toBeLessThan(10);
            });
        }));


        it('can post Question', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.postQuestion(fakeData).then(status => {
                expect(status).toEqual(200);
            });
        }));

        it('can search specific questions', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getSearchedQuestion("A", ["B"]).then(status => {
                expect(status).not.toBeUndefined();
            });
        }));

        it('can select best answer for Question', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.selectAnswer(1, 2).then(status => {
                expect(status).toEqual(200);
            });
        }));

        it('can handle error', async(() => {
            expect(service.handleError).toThrow();
        }))
    });
})
