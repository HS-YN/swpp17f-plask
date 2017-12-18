// import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';


// import { SignInComponent } from './signin.component';
// import { AppModule } from '../app.module';

// let comp: SignInComponent;
// let fixture: ComponentFixture<SignInComponent>;

// describe('SignInComponent', () => {
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [AppModule, RouterTestingModule.withRoutes([]) ]
//         }).compileComponents().then(() => {
//             fixture = TestBed.createComponent(SignInComponent);
//             comp = fixture.componentInstance;
//             fixture.detectChanges();
//             fixture.whenStable().then(() => {
//                 fixture.detectChanges();
//             })
//         });
//     }));

//     it('can be instantiated', () => {
//         expect(comp).not.toBeNull();
//         expect(comp).toBeTruthy();
//     });

//     it('can be initialized', () => {
//         expect(comp.ngOnInit).toThrow();
//         expect(comp.SignIn).toThrow();
//         expect(comp.goToMain).toThrow();
//         expect(comp.goToSignUp).toThrow();
//     })

//     it('should have as title Plask!,', async(() => {
//         fixture.whenStable().then(() => {
//             expect(comp.title).toEqual('Plask!');
//         })
//     }))

//     it('should have as subtitle Location-based live Q&A platform', async(() => {
//         fixture.whenStable().then(() => {
//         expect(comp.subtitle).toEqual('Location-based live Q&A platform');
//         })
//     }))

//     it('should have user notificaiton frequency set to 1 as default', () => {
//         expect(comp.user.notiFrequency).toEqual(1);
//     });


//     it('should have Email: as the first label', async(() => {
//         let label = fixture.debugElement.queryAll(By.css('label')).map(de => de.nativeElement);
//         expect(label[0]).not.toBeNull();
//     }))

//     // Added in Sprint 3
//     it ('should have display correct labels for input', async(() => {
//         const labels = fixture.debugElement.queryAll(By.css('label'));
//         const emailLabel = labels[0].nativeElement;
//         const passwordLabel = labels[1].nativeElement;

//         expect(emailLabel.classList.contains("Email:")).toBeTruthy();
//         expect(passwordLabel.classList.contains("Password:")).toBeTruthy();
//     }))

//     it ('can navigate to signup', async(() =>{
//         let navigateSpy = spyOn((<any>comp).router, 'navigate');
//         comp.goToSignUp();
//         expect(navigateSpy).toHaveBeenCalledWith(['/signup']);
//     }))

// });
