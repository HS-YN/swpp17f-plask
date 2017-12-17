import { Component, OnInit, HostListener } from '@angular/core';
import { ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user/user';
import { Question } from '../question/question';
import { Location } from '../location/location';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { QuestionService } from '../question/question.service';
import { MainService } from './main.service';

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
        private mainService: MainService,
        private elementRef: ElementRef,
    ){ }

    question:Question = {id:0, content:"", author:"", locations:"",
    services:"", select_id:-1, time:""};

    countryList: Location[];
    provinceList: Location[] = [];
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
            this.serviceRefresh();

            // Send welcome message :)
            this.notify("Plask!", "Thank you! You can now receive notifications :)");

            // Connect to websocket & Listen for messages
            this.socket = new WebSocket("ws://localhost:8000/notification");
            this.socket.addEventListener('message', this.receiveAndNotify);
        });
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
            this.questionServiceRefresh();
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
/*
    getLocationByName (locList: Location[], name: string): Location {
        for (var i = 0; i < locList.length; i++) {
            if (name.localeCompare(locList[i].loc_name) === 0)
                return locList[i];
        }
        return null;
    }
*/
    countryRefresh(): void {
        this.locationService.getCountryList().then(country => {
                if(country.length <= 0)
                    this.countryList = null;
                else
                    this.countryList = country;
            })
    }//Due to NgOnInit, this function cannot be detached from this component.

    countrySelect(country: string): void {
        if (country == 'Country'){
            this.askCountry = "";
            this.provinceList = null;
        }
        else{
            this.askCountry = country;
            this.provinceRefresh(this.mainService.getLocationByName (
                this.countryList, country).loc_code, this.provinceList);
            console.log(this.provinceList);
        }
        if (this.cityAutoComplete != null){
            delete this.cityAutoComplete;
        }
        this.askProvince= "";
        this.askCity = "";
    }

    provinceRefresh(country_code: number, provinceList: Location[]): void {
        this.locationService.getLocationList(country_code.toString())
            .then(province => {
                if(province.length <= 0)
                    provinceList = [];
                else
                    provinceList = province;
            })
    }

    provinceSelect(province: string): void {
        if (province == 'Province'){
            this.askProvince = '';
            this.askCity = "";
            if (this.cityAutoComplete != null){
                delete this.cityAutoComplete;
            }
        }
        else{
            this.askProvince = province;
            this.askCity = "";
            this.cityRefresh(this.mainService.getLocationByName (this.countryList, this.askCountry).loc_code,
                this.mainService.getLocationByName (this.provinceList, province).loc_code);
        }
    }

    cityRefresh(country_code: number, province_code: number): void {
        var address: string = country_code.toString() + '/' + province_code.toString();
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0)
                    this.cityList = null;
                else {
                    this.cityList = city;
                    var cityNameList = [];
                    for (var i = 0; i < this.cityList.length; i++)
                        cityNameList.push(this.cityList[i].loc_name);
                    this.cityAutoComplete = new AutoCompleteComponent(this.elementRef, cityNameList);
                }
            })
    }

    //Update service tag visualization
    serviceRefresh(): void {
        this.userService.getService()
            .then(service => {
                if(service.length <= 0)
                    this.serviceList = null;
                else {
                    this.serviceList = service;
                    this.serviceAutoComplete = new AutoCompleteComponent(this.elementRef, this.serviceList);
                }
            })
    }


    questionServiceRefresh(): void {
        if(this.question.services == "") {
            this.questionServiceList = null;
            return;
        }
        this.questionServiceList = this.question.services
            .substr(0, this.question.services.length-1).split(';');
    }

    // Subroutine of questionServiceAdd: actual append happens here
    questionServiceSelect(service: string): void {
        var validity_check: string = service + ';';
        if (this.question.services.indexOf(validity_check) != -1){
            alert("Tag Already Added!");
            return;
        }
        this.question.services = this.question.services + service + ';';
        this.questionServiceRefresh();
    }

    questionServiceDelete(deleteService: string): void {
        deleteService = deleteService + ';';
        this.question.services = this.question.services.replace(deleteService, '');
        this.questionServiceRefresh();
    }

    questionServiceAdd(): void {
        this.serviceTag = this.serviceAutoComplete.query;
        if(this.serviceTag == ""){
            alert("Tag is Empty!");
        }
        else if (this.serviceTag.indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this.serviceTag.length >= 100) {
            alert("Tag length should be less than 100 characters.")
        }
        else{
            this.questionServiceSelect(this.serviceTag);
            this.serviceTag = "";
            this.serviceAutoComplete.query = "";
        }
    }
    //Methods for searching, with tagging location
    countrySearch(country: string): void {
        // Guard against selecting dropdown list as option
        if (country == "Country"){
            this.searchCountry = "";
        }
        else{
            this.searchCountry = country;
        }

        if(country != 'Country') {
            this.provinceRefresh(this.mainService.getLocationByName (this.countryList, country).loc_code, this.searchProvinceList);
        } else {
            this.searchProvinceList = null;
        }
        if (this.searchCityAutoComplete != null){
            delete this.searchCityAutoComplete;
        }
        this.searchProvince= "";
        this.searchCity = "";
    }

    searchProvinceRefresh(country_code: number): void {
        this.locationService.getLocationList(country_code.toString())
            .then(province => {
                if(province.length <= 0)
                    this.searchProvinceList = null;
                else
                    this.searchProvinceList = province;
            })
    }

    provinceSearch(province: string): void {
        if (province == 'Province') {
            this.searchProvince = "";
            this.searchCity = "";
            if(this.searchCityAutoComplete != null){
                delete this.searchCityAutoComplete;
            }
        }
        else {
            this.searchProvince = province;
            this.searchCity = "";
            this.searchCityRefresh(this.mainService.getLocationByName (this.countryList, this.searchCountry).loc_code,
                this.mainService.getLocationByName (this.searchProvinceList, province).loc_code);
        }
    }

    searchCityRefresh(country_code: number, province_code: number): void {
        var address: string = country_code.toString() + '/' + province_code.toString();
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0)
                    this.searchCityList = null;
                else {
                    this.searchCityList = city;
                    var searchCityNameList = [];
                    for (var i = 0; i < this.searchCityList.length; i++)
                        searchCityNameList.push(this.searchCityList[i].loc_name);
                    this.searchCityAutoComplete = new AutoCompleteComponent(this.elementRef, searchCityNameList);
                }
            })
    }
    //method called by clicking search button
    search():void {
        let index:Number[] = [-1, -1, -1] // 0:country, 1:province, 2:city code num
        if((this.searchCountry == "")){
            alert("Please select country tag!");
            return;
        }
        if(this.searchString == ""){
            alert("Please fill content before searching!");
            return;
        }
        // NOTE: searchCityAutoComplete does not exist if only country is selected
        if(this.searchCityAutoComplete != null ){
            this.searchCity = this.searchCityAutoComplete.query;

            if((this.searchCity != "") && (this.searchCityAutoComplete.rawList.indexOf(this.searchCity) == -1)){
                console.log(this.searchCity);
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
             'search',index[0],index[1],index[2],this.searchString]}}
         ]));
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

        }
        // Do not request for permission if
        else{
            // either already "granted" or "denied"
        }
    }
    //methods for Plask Question Dropdown button
    //Open Dropdown when clicked
    myFunction():void {
            document.getElementById("myDropdown").classList.toggle("show");
    }
    //Close when click somewhere else
    @HostListener('document:click', ['$event'])
    onClick(event) {
        var target = event.target;
        if (!target.closest(".dropdown") && !target.closest(".container") && !target.closest(".suggestions")) {
            document.getElementById("myDropdown").classList.toggle("show", false);
        }
    }

    /*notifyWithPermission(title: string, body: string){
        // Check if the browser supports notification
        if (!("Notification" in window)){
            alert("This browser does not support notification :(");
        }
        // send notification only when permission is "granted"
        else if (Notification.permission === "granted"){

            var options = {
                body: body,
            }
            var notification = new Notification(title, options);
            setTimeout(notification.close.bind(notification), 5000);
        }
        // Do not send notification if permission is not granted
        else{
        }
    }*/

    // Remove Event Listener upon OnDestroy cycle
    ngOnDestroy(): void {
        this.socket.removeEventListener('message', this.receiveAndNotify);
    }


}/* istanbul ignore next */
