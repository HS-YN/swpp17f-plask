import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Location } from './location';
import { LocationService } from './location.service';

const locationData = [
  { loc_code: 213, loc_name: 'Korea' },
  { loc_code: 1, loc_name: 'Busan' },
  { loc_code: 1, loc_name: 'Buk' },
] as Location[];

describe('LocationService (mockBackend)', () => {
      beforeEach( async(() => {
        TestBed.configureTestingModule({
              imports: [ HttpModule ],
              providers: [LocationService, { provide: XHRBackend, useClass: MockBackend }]
        }).compileComponents();
      }));

      it('can instantiate service when injected',
        inject([LocationService], (service: LocationService) => {
          expect(service instanceof LocationService).toBe(true);
      }));

      it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new LocationService(http);
      expect(service instanceof LocationService).toBe(true, 'new service should be ok');
      }));

      it('can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
          expect(backend).not.toBeNull('backend should be provided');
      }));

    describe('when getting location list', () => {
        let backend: MockBackend;
        let service: LocationService;
        let fakeData: Location[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new LocationService(http);
            fakeData = locationData;
            response = new Response(new ResponseOptions({body: locationData}));
        }));

        it('should get list of countries', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getCountryList().then(data => {
                expect(data).toBe(locationData);
            });
        }));

        it('should get list of provinces or cities', async(() => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getLocationList(locationData[0].loc_code.toString()).then(data => {
                expect(data[0].loc_name).toBe('Busan');
            });
        }));

        it('can handle error', async(() => {
            expect(service.handleError).toThrow();
        }))
    });
})
