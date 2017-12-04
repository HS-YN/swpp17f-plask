import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { User } from './user';
import { UserService } from './user.service';

const userListData = [
    { email: 'a@a.a', password: '12', username: 'John', locations: 'Korea;',
      services: 'Travel;', blockedServices: 'Music;', notiFrequency: 2},
    { email: 'b@b.b', password: '34', username: 'Jane',
      locations: 'Korea/Seoul;Korea;', services: 'Music;', blockedServices: 'Travel;',
      notiFrequency: 3},
] as User[];

const userData = { email: 'c@c.c', password: '56', username: 'Temp',
    locations: 'Japa;', services: 'Travel;Music;', blockedServices: '',
    notiFrequency: 5} as User;

describe('UserService (mockBackend)', () => {
      beforeEach( async(() => {
        TestBed.configureTestingModule({
              imports: [ HttpModule ],
              providers: [UserService, { provide: XHRBackend, useClass: MockBackend }]
        }).compileComponents();
      }));

      it('can instantiate service when injected',
        inject([UserService], (service: UserService) => {
          expect(service instanceof UserService).toBe(true);
      }));

      it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new UserService(http);
      expect(service instanceof UserService).toBe(true, 'new service should be ok');
      }));

      it('can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
          expect(backend).not.toBeNull('backend should be provided');
      }));

    describe('when instantiating user', () => {
        it('shoule have default values', () => {
            let user: User = new User;
            expect(user.locations).toBe('');
            expect(user.blockedServices).toBe('');
            expect(user.services).toBe('');
            expect(user.notiFrequency).toBe(1);
        })
    })

    describe('when modifying user', () => {
        let backend: MockBackend;
        let service: UserService;
        let fakeData: User;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new UserService(http);
            fakeData = userData;
            response = new Response(new ResponseOptions({status: 200}));
        }));

        it('should check existing user', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getUser().then(user => {
                expect(user).toBeNull();
            });
        }));

        it('can sign in', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.signIn(userData).then(status => {
                expect(status).toEqual(200);
            });
        }));

        it('can sign up', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.signUp(fakeData).then(status => {
                expect(status).toEqual(200);
            });
        }));

        it('can update data', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.update(fakeData).then(status => {
                expect(status).not.toBeNull();
            });
        }));

        it('can sign out', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.signOut().then(status => {
                expect(status).toEqual(200);
            });
        }));

        it('can handle error', async(() => {
            expect(service.handleError).toThrow();
        }))
    });
})
