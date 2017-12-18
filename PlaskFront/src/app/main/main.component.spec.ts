import { TestBed, ComponentFixture, async  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppModule } from '../app.module';
import { MainComponent } from './main.component';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';

import { User } from '../user/user'; 
import { Location } from '../location/location';
import { Question } from  '../question/question';
import { Answer } from '../answer/answer';

import { AutoCompleteComponent } from '../interface/autocomplete.component';


let comp: MainComponent;
let fixture: ComponentFixture<MainComponent>;
declare var Notification: any;

describe('MainComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ AppModule, RouterTestingModule.withRoutes([]) ],
        }).overrideModule(AppModule, { 
            remove: { 
                providers: [ 
                    UserService, LocationService, QuestionService,
                ] 
            },
            add: { 
                providers: [ 
                    { provide: LocationService, useClass: FakeLocationService }, 
                    { provide: UserService, useClass: FakeUserService },
                    { provide: QuestionService, useClass: FakeQuestionService},
                ] 
            }
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MainComponent);
            comp = fixture.componentInstance;

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
            });
        });
    }));

    it('can be instantiated', () => {
        expect(comp).not.toBeNull();
        expect(comp).toBeTruthy();
    });

    it('can properly initialize data', async(() => {
        fixture.whenStable().then(() => {
            expect(comp.tabNum).toEqual(1);
            expect(comp.questionList[0][0]).toEqual(fakeRelatedQuestions[0]);
            expect(comp.user).toEqual(fakeUsers[1]);
        });
    }));

    it('should ask for permission when permission is default', async(() => {    
        Notification.permission = "default";
        comp.notify("Plask!", "Hello!");

        fixture.whenStable().then(() => {
            expect(Notification.requestPermission()).toHaveBeenCalled();            
        })
    }))

    it('should alert if service is empty', async(() => {
        let spy = spyOn(window, "alert");
        comp.serviceAutoComplete.query = "";
        comp.serviceAdd("serviceTag", "serviceAutoComplete", "question", "questionServiceList");

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Tag is Empty!");
        })
    }))

    it('should alert if service incldues a semicolon', async(() => {
        let spy = spyOn(window, "alert");
        comp.serviceAutoComplete.query = ";";
        comp.serviceAdd("serviceTag", "serviceAutoComplete", "question", "questionServiceList");

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("You cannot use SemiColon!");
        })
    }))

    it('should alert if service length >= 100', async(() => {
        let spy = spyOn(window, "alert");
        comp.serviceAutoComplete.query = "qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopa";
        comp.serviceAdd("serviceTag", "serviceAutoComplete", "question", "questionServiceList");

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Tag length should be less than 100 characters.");
        })
    }))    

    it('should properly add service tag', async(() => {
        let spy = spyOn(comp, "serviceSelect");
        comp.question.services = "cafe;";
        comp.serviceAutoComplete.query = "music";
        comp.serviceAdd("serviceTag", "serviceAutoComplete", "question", "questionServiceList");

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
            expect(comp.serviceTag).toEqual("");
            expect(comp.serviceAutoComplete.query).toEqual("");
        });       
    }));

    it('should alert if trying to add already added tag', async(() => {
        let spy = spyOn(window, "alert");
        comp.question.services = "Music;";
        comp.serviceSelect("Music", "question", "questionServiceList");

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Tag Already Added!");
        });
    }));

    it ('should send alert message when trying send send empty quesiton', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.question.content = "";
        comp.sendQuestion();
 
        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Question is Empty!");
        });
    }));

    it('should send alert message if Question does not have a selected country', async(() => {
        let windowSpy = spyOn(window, "alert");

        comp.question.content = "test";
        comp.askCountry = "";
        comp.sendQuestion();
        
        fixture.whenStable().then(() => {
            expect(windowSpy).toHaveBeenCalledWith("Please select country!");
        });
    }));

    it('should alert if autoComplete is invalid', async(() => {
       let windowSpy = spyOn(window, "alert");
       var cityList: string[] = ["Gwanak", "Gangnam"];
       comp.searchCityAutoComplete = new AutoCompleteComponent(fixture.elementRef, cityList);
       comp.searchCityAutoComplete.query = "Gwanafaefasfeak";

       comp.sendQuestion();

       fixture.whenStable().then(() => {
           expect(windowSpy).toHaveBeenCalledWith("Invalid city name.");
       })
    }))

    it('should properly send question', async(() => {
        let spy = spyOn(window, "alert");
        comp.question.content = "Hello there!";
        comp.question.locations = "USA;";
        comp.askCountry = "Korea";
        comp.askProvince = "";
        comp.askCity = "";

        comp.sendQuestion();   

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Question successfully plasked!");
        });
    }));

    it('should properly send question w/ Province', async(() => {
        let spy = spyOn(window, "alert");
        comp.question.content = "Hello there!";
        comp.question.locations = "USA;";
        comp.askCountry = "Korea";
        comp.askProvince = "Seoul";
        comp.askCity = "";

        comp.sendQuestion();   

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Question successfully plasked!");
        });
    }));

    it('should properly send question w/ City', async(() => {
        let spy = spyOn(window, "alert");
        comp.question.content = "Hello there!";
        comp.question.locations = "USA;";
        comp.askCountry = "Korea";
        comp.askProvince = "Seoul";
        comp.askCity = "Gwanak";

        comp.sendQuestion();   

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Question successfully plasked!");
        });
    }));

    it('can properly send question w/ City', async(() => {
        let spy = spyOn(window, "alert");
        comp.question.content = "";
        comp.question.locations = "USA;";
        comp.askCountry = "Korea";
        comp.askProvince = "Seoul";
        comp.askCity = "Gwanak";

        comp.sendQuestion();   

        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalledWith("Question could not be sent, please try again");
        });
    }));


    it('can navigate to settings', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        comp.goToSettings();
        expect(navigateSpy).toHaveBeenCalledWith(['/settings']);
    }))

    it('can navigate to signout', async(() => {
        let navigateSpy = spyOn((<any>comp).router, 'navigate');
        expect(comp.goSignOut).toThrow();
    }))

});

export const fakeCountryList: Location[] = [ 
    { loc_name: 'Korea', loc_code: 1 },
    { loc_name: 'Canada', loc_code: 2 },
    { loc_name: 'USA', loc_code: 3 },
];
export const fakeProvinceList: Location[] = [ 
    { loc_name: 'Seoul', loc_code: 4 },
    { loc_name: 'Jeju', loc_code: 5 }, 
    { loc_name: 'Daegu', loc_code: 6 },
];
export const fakeCityList: Location[] = [
    { loc_name: 'Gangnam', loc_code: 7 },
    { loc_name: 'Gwanak', loc_code: 8 },
    { loc_name: 'Seocho', loc_code: 9 }
];

class FakeLocationService {
    getCountryList(): Promise<Location[]> {
        return Promise.resolve<Location[]>(fakeCountryList);
    }

    getLocationList(location: string): Promise<Location[]> {
        if(location == "1" || location =="2" || location =="3"){
            return Promise.resolve<Location[]>(fakeProvinceList);            
        }
        else{
            return Promise.resolve<Location[]>(fakeCityList);
        }

    }    
}

export const fakeUsers: User[] = [
    {email: 'swpp@gmail.com', password: 'iluvswpp', username: 'swpplover', locations: 'Korea/Seoul/Gwanak;', services: 'SNU;Cafe;', blockedServices: ';', notiFrequency: 10},
    {email: 'test1@gmail.com', password: 'test1', username: 'testuser1', locations: 'Korea/Seoul;', services: 'Music;Guitar;', blockedServices: ';', notiFrequency: 10},
];
export const fakeServices: string[] = ['Music', 'Cafe', 'SWPP', 'SNU'];

class FakeUserService {
  signIn(user: User): Promise<number>{
      for(let i = 0; i < fakeUsers.length; ++i){
          if ((user.email == fakeUsers[i].email) && (user.password == fakeUsers[i].password)){
              return Promise.resolve<number>(204);
          }
      }
      return Promise.resolve<number>(403);
  }

  signUp(user: User): Promise<number> {
      return Promise.resolve<number>(201); // assume success :)
  }

  getUser(): Promise<User> {
      return Promise.resolve<User>(fakeUsers[1]);
  }

  getService(): Promise<string[]> {
      return Promise.resolve<string[]>(fakeServices);
  }

  updateUser(user: User): Promise<User> {
      return Promise.resolve<User>(user);
  }
}

export const fakeRelatedQuestions: Question[] = [
    {id: 1, content: "Hello there!", author: "swpplover", locations: "Korea/Seoul;", services: "SNU;Welcome;", select_id: -1, time: "2017.12.18"},
    {id: 2, content: "Is there a BurgerKing in Nakseongdae?", author: "testuser1", locations: "Korea/Seoul/Gwanak;", services: "Burger;Food;", select_id: -1, time: "2017.12.18"},
];
export const fakeMyQuestions: Question[] = [
    {id: 3, content: "Can I print near building 83?", author: "testuser1", locations: "Korea/Seoul/Gwanak;", services: "SNU;Printer;", select_id: -1, time: "2017.12.18"},
    {id: 2, content: "Is there a BurgerKing in Nakseongdae?", author: "testuser1", locations: "Korea/Seoul/Gwanak;", services: "Burger;Food;", select_id: -1, time: "2017.12.18"},
];
export const fakeAnsweredQuestions: Question[] = [
    {id: 1, content: "Hello there!", author: "swpplover", locations: "Korea/Seoul;", services: "SNU;Welcome;", select_id: -1, time: "2017.12.18"},
    {id: 4, content: "Is there an empty cafe in Gangnam right now?", author: "testuser10", locations: "Korea/Seoul/Gangnam;", services: "Cafe;", select_id: -1, time: "2017.12.18"},
];
export const fakeSearchedQuestions: Question[] = [
    {id: 1, content: "Hello there!", author: "swpplover", locations: "Korea/Seoul;", services: "SNU;Welcome;", select_id: -1, time: "2017.12.18"},
    {id: 5, content: "Hello Hello!!", author: "testuser5", locations: "Korea/Seoul/Gangnam;", services: "Cafe;", select_id: -1, time: "2017.12.18"},
];


class FakeQuestionService {

    getQuestion(tab: number): Promise<Question[]> {
        switch(tab){
            case 1: {
                return Promise.resolve<Question[]>(fakeRelatedQuestions);
            } case 2: {
                return Promise.resolve<Question[]>(fakeMyQuestions);
            } case 3: {
                return Promise.resolve<Question[]>(fakeAnsweredQuestions);
            }
        }
    }

    getSearchedQuestion(searchString: string, loc_code: string[]){
        return Promise.resolve<Question[]>(fakeSearchedQuestions);
    }

    postQuestion(question: Question): Promise<number> {
        if (question.content == ""){
            return Promise.resolve<number>(403);
        }
        else{
            return Promise.resolve<number>(204);            
        }
    }

}
