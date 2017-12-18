import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { AppModule } from '../app.module';
import { Answer } from './answer';
import { AnswerService } from './answer.service';

const answerData = { author: 'George', content: 'Test Answer 3'} as Answer;

const makeAnswersData = () => [
    { author: 'Mark', content: 'Test Answer 1', question_id: 1},
    { author: 'Bill', content: 'Test Answer 2', question_id: 1},
    { author: 'June', content: 'Test Answer 3', question_id: 2},
    { author: 'Peter', content: 'This is asesome!', question_id: 3},
    { author: 'Stella', content: 'Yeah I know!', question_id: 3},
] as Answer[];

const AnswersData = [
    { author: 'Mark', content: 'Test Answer 1', question_id: 1},
    { author: 'Bill', content: 'Test Answer 2', question_id: 1},
    { author: 'June', content: 'Test Answer 3', question_id: 2},
    { author: 'Peter', content: 'This is asesome!', question_id: 3},
    { author: 'Stella', content: 'Yeah I know!', question_id: 3},
] as Answer[];

describe('AnswerService (mockBackend)', () => {
      beforeEach( async(() => {
        TestBed.configureTestingModule({
              imports: [ HttpModule ],
              providers: [AnswerService, { provide: XHRBackend, useClass: MockBackend }]
        }).compileComponents();
      }));

      it('can instantiate service when injected',
        inject([AnswerService], (service: AnswerService) => {
          expect(service instanceof AnswerService).toBe(true);
      }));

      it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new AnswerService(http);
      expect(service instanceof AnswerService).toBe(true, 'new service should be ok');
      }));

      it('can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
          expect(backend).not.toBeNull('backend should be provided');
      }));

    describe('when instantiating question', () => {
        it('shoule have default values', () => {
            let answer: Answer = new Answer;
            expect(answer.author).toBeUndefined();
        })
    })

    describe('when modifying Answer', () => {
        let backend: MockBackend;
        let service: AnswerService;
        let fakeAnswer: Answer;
        let fakeAnswerList: Answer[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new AnswerService(http);
            fakeAnswerList = AnswersData;
            fakeAnswer = answerData;

            response = new Response(new ResponseOptions({status: 200, body: {data: fakeAnswerList}}));
        }));

        it('should be OK returning no quetions', async(inject([], () => {
           // make a mock empty response
           let resp = new Response(new ResponseOptions({status: 200, body:[]}));
           // subscribe the backend to this response.
           backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

           service.getAnswer(4)
             .then(Answers => {
               expect(Answers.length).toBe(0, 'should have no answers');
             })
        })));


        it('can get AnswerList', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAnswer(1).then(Answers => {
                expect(Answers['data'].length).toBeGreaterThan(1);
            });
        }));

        it('can post Answer', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.postAnswer(fakeAnswer.content, 1).then(status => {
                expect(status).toBe(200);
            });
        }));

        it('shold receive proper status code when sending question', async(inject([], () => {
          backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

          service.postAnswer(fakeAnswer.content, 1).then(res => { expect(res).toEqual(200)})

        })));

        it('can handle error', async(() => {
            expect(service.handleError).toThrow();
        }))
    });
})
