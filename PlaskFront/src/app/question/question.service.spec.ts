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
            expect(question.locations).toBe('');
            expect(question.services).toBe('');
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
            response = new Response(new ResponseOptions({status: 200}));
        }));

        it('can get QuestionList', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getQuestion().then(Questions => {
                expect(Questions).toBeNull();
            });
        }));

        it('can get Recent QuestionList', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getRecentQuestion().then(Questions => {
                expect(Questions).toBeNull();
            });
        }));

        it('can get RelatedQuestionList', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getRelatedQuestion().then(Questions => {
                expect(Questions).toBeNull();
            });
        }));

        it('can get AnsweredQuestionList', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAnsweredQuestion().then(Questions => {
                expect(Questions).toBeNull();
            });
        }));


        it('can post Question', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.postQuestion(fakeData).then(status => {
                expect(status).toEqual(200);
            });
        }));


        it('can handle error', async(() => {
            expect(service.handleError).toThrow();
        }))
    });
})
