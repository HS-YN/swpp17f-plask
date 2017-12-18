import { Component, OnInit, HostListener } from '@angular/core';
import { ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user/user';
import { Question } from '../question/question';
import { Location } from '../location/location';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { QuestionService } from '../question/question.service';
import { TagService } from './tag.service';

import { AutoCompleteComponent } from '../interface/autocomplete.component';

declare var Notification: any;

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.css'],
})

export class MainComponent implements OnInit, OnDestroy{

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
        private tagService: TagService,
        private elementRef: ElementRef,
    ){ }

    question:Question = {id:0, content:"", author:"", locations:"",
    services:"", select_id:-1, time:""};

    countryList: Location[];
    provinceList: Location[];
    cityList: Location[];
    serviceList: string[]; //List of service tags from Backend
    searchProvinceList: Location[];
    searchCityList: Location[]; //use this to find location code

    askCountry: string = "";
    askProvince: string = "";
    askCity: string = "";

    questionServiceList: string[]; //List for current question service tags
    serviceTag: string = ""; //User-input string

    searchString: string = "";
    searchCountry: string = "";
    searchProvince: string = "";
    searchCity: string = "";

    cityAutoComplete: AutoCompleteComponent;
    serviceAutoComplete: AutoCompleteComponent;
    searchCityAutoComplete: AutoCompleteComponent;

    socket: WebSocket;

    ngOnInit(): void{
        this.userService.getUser().then(user => {
            this.question.author = user.username;
            this.countryRefresh();
            this.serviceFetch();
            // Send welcome message :)
            this.notify("Plask!", "Thank you! You can now receive notifications :)");
            // Connect to websocket & Listen for messages
            this.socket = new WebSocket("ws://localhost:8000/notification");
            this.socket.addEventListener('message', this.receiveAndNotify);
        });
    }

    ngOnDestroy(): void {
        this.socket.removeEventListener('message', this.receiveAndNotify);
    }

    // Notification

    notify(title:string, body: string){
        // Check if the browser supports notification
        if (!("Notification" in window)){
            alert("This browser does not support notification :(");
        }
        // if the user hasn't set the notification permission, ask for permission
        else if (Notification.permission === "default"){
            Notification.requestPermission().then(() => {
                if (Notification.permission === "granted"){
                    var options = {
                        body: body,
                    }
                    var notification = new Notification(title, options);
                    setTimeout(notification.close.bind(notification), 5000);
                }
            })
        }//Do not request for permission if either already "granted" or "denied"
    }

    receiveAndNotify (event) {
        if (Notification.permission === "granted"){
            var options = {
                body: "Answer has arrived!\n" + event.data,
            }
        var notification = new Notification("Plask!", options);
        setTimeout(notification.close.bind(notification), 5000);
        }
    }

    // Location & Service Tags

    countryRefresh: () => void = this.tagService.countryRefresh;

    provinceRefresh: (country_code: number,
        provinceList: string) => void = this.tagService.provinceRefresh;

    cityRefresh: (c_code: number, p_code: number, cityList: string,
        cityAuto: string) => void = this.tagService.cityRefresh;

    countrySelect: (country: string, askCountry: string, askProvince: string,
        askCity: string, provinceList: string,
        cityAuto: string) => void = this.tagService.countrySelect;

    provinceSelect: (province: string, askCountry: string, askProvince: string,
        askCity: string, provinceList: string, cityList: string,
        cityAuto: string) => void = this.tagService.provinceSelect;
    //Update service tag visualization
    serviceFetch(): void {
        this.userService.getService()
            .then(service => {
                if(service.length <= 0)
                    this.serviceList = null;
                else {
                    this.serviceList = service;
                    this.serviceAutoComplete = new AutoCompleteComponent(
                        this.elementRef, this.serviceList);
                }
            })
    }

    serviceRefresh: (question: string,
        questionServiceList: string) => void = this.tagService.serviceRefresh;

    serviceDelete: (deleteService: string, question: string,
        questionServiceList: string) => void = this.tagService.serviceDelete;

    serviceAdd(serviceTag: string, serviceAutoComplete: string,
        question: string, questionServiceList: string): void {
        this[serviceTag] = this[serviceAutoComplete].query;
        if(this[serviceTag] == ""){
            alert("Tag is Empty!");
        }
        else if (this[serviceTag].indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this[serviceTag].length >= 100) {
            alert("Tag length should be less than 100 characters.")
        }
        else{
            this.serviceSelect(this[serviceTag], question, questionServiceList);
            this[serviceTag] = "";
            this[serviceAutoComplete].query = "";
        }
    }
    //Subroutine of questionServiceAdd: actual append happens here
    serviceSelect(service: string, question: string,
        questionServiceList: string): void {
        var validity_check: string = service + ';';
        if (this[question].services.indexOf(validity_check) != -1){
            alert("Tag Already Added!");
        }
        else {
            this[question].services = this[question].services + service + ';';
            this.serviceRefresh(question, questionServiceList);
        }
    }

    // Send & Search

    sendQuestion(): void{
        if(this.question.content == ""){
            alert("Question is Empty!");
        }
        else{
            if(this.askCountry == ""){
                alert("Please select country!");
                return;
            }
            if (this.cityAutoComplete != null){
                this.askCity = this.cityAutoComplete.query;
                if((this.askCity!="") &&
                    (this.cityAutoComplete.rawList.indexOf(this.askCity)==-1)) {
                    alert("Invalid city name!");
                    return;
                }
            }

            var newLocation: string = this.askCountry;
            if(this.askProvince != ""){
                newLocation = newLocation + '/' + this.askProvince;
                if(this.askCity != ""){
                    newLocation = newLocation + '/' + this.askCity;
                }
            }
            this.question.locations = newLocation + ';';

            let path = this.route.snapshot.url.join('/')
            this.questionService.postQuestion(this.question)
            .then(Status => {
                if(Status != 204) {
                    alert("Question could not be sent, please try again");
                }
                else {
                    alert("Question successfully plasked!");
                }
            }).then(() => this.router.navigateByUrl(
                '/settings', {skipLocationChange: true})).then(
            () => this.router.navigate([path]));

            this.question.content = "";
            this.question.services = "";
            this.question.locations = "";
            this.serviceRefresh("question", "questionServiceList");
            this.countryRefresh();
            if(this.cityAutoComplete != null){
                delete this.cityAutoComplete;
            }
            this.askCountry = "";
            this.askProvince = "";
            this.askCity = "";
            this.provinceList = null;
            this.cityList = null;
        }
    }

    search():void {
        let index:Number[] = [-1, -1, -1] // [country, province, city code]
        if((this.searchCountry == "")){
            alert("Please select country tag!");
            return;
        }
        if(this.searchString == ""){
            alert("Please fill content before searching!");
            return;
        }
        if(this.searchCityAutoComplete != null ){
            this.searchCity = this.searchCityAutoComplete.query;
            if((this.searchCity != "") && (this.searchCityAutoComplete.rawList.
                indexOf(this.searchCity) == -1)){
                alert("Invalid city name!");
                return;
            }
        }
        for(let ctry of this.countryList){
           if(ctry.loc_name === this.searchCountry)
               index[0] = ctry.loc_code;
        }
        if(this.searchProvince != "")
            for(let prvc of this.searchProvinceList){
                if(prvc.loc_name === this.searchProvince)
                    index[1] = prvc.loc_code;
            }
        if(this.searchCity != "")
            for(let cty of this.searchCityList){
                if(cty.loc_name === this.searchCity)
                    index[2] = cty.loc_code;
            }

         this.router.navigateByUrl('/settings',{skipLocationChange: true}).then(
             () => this.router.navigate(['/main', {outlets:{'tab':[
             'search',index[0],index[1],index[2], this.searchString]}}
         ]));
    }
    //Open Plask Question Dropdown when clicked
    myFunction():void {
            document.getElementById("myDropdown").classList.toggle("show");
    }
    //Close when somewhere else is clicked
    @HostListener('document:click', ['$event'])
    onClick(event) {
        var target = event.target;
        if (!target.closest(".dropdown") && !target.closest(".container") && !target.closest(".suggestions")) {
            document.getElementById("myDropdown").classList.toggle("show", false);
        }
    }

    goToSettings(): void{
         this.router.navigate(['/settings']);
    }

    goSignOut(): void{
        this.userService.signOut().then(() => this.router.navigate(['/signin']));
    }

    gotoMainTab(): void{
        this.router.navigateByUrl("/main(tab:maintab;open=true)");
        //(['/main/maintab']);
    }

}/* istanbul ignore next */
