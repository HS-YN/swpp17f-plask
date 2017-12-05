//Import Basic Modules
import { Component, OnInit, HostListener, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user/user';
import { Question } from '../question/question';
import { Location } from '../location/location';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { QuestionService } from '../question/question.service';

import { AutoCompleteComponent } from '../interface/autocomplete.component';
declare var Notification: any;

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.css'],
})
export class MainComponent implements OnInit{
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
        private elementRef: ElementRef,
    ){ }

    question:Question = {id:0, content:"", author:"", locations:"", services:""};

    countryList: Location[];
    provinceList: Location[];
    cityList: Location[];
    cityNameList: string[];
    cityAutoComplete: AutoCompleteComponent;

    selectedCountry: string = "";
    selectedProvince: string = "";
    selectedCity: string = "";

    serviceList: string[]; //List of service tags from Backend
    serviceAutoComplete: AutoCompleteComponent;
    questionServiceList: string[]; //List for visualizing current question service tags
    serviceTag: string = ""; //User-input string

    //variables for searching
    searchString: string = "";
    searchCountry: string = "";
    searchNation: string = "";
    searchProvince: string = "";
    searchCity: string = "";
    searchCityNameList: string[];
    searchCityAutoComplete: AutoCompleteComponent;
    searchProvinceList: Location[];
    searchCityList: Location[]; //use this to find location code

    ngOnInit(): void{
        this.userService.getUser().then(user => {
            this.question.author = user.username;
            this.countryRefresh();
            this.serviceRefresh();
            // Notification Method
            this.notify("Plask!", "Thank you! You can now receive notifications :)");
            this.notifyWithPermission("Plask!", "Welcome Back " + this.question.author);            
        });

    }

    goToSettings(): void{
         this.router.navigate(['/settings']);
    }

    goSignOut(): void{
        this.userService.signOut().then(() => this.router.navigate(['/signin']));
    }


    //Route between tabs
    gotoMainTab(): void{
        this.router.navigateByUrl("/main(tab:maintab;open=true)");
        //(['/main/maintab']);
    }



    sendQuestion(): void{
        if(this.question.content == ""){
            alert("Question is Empty!");
        }
        else{
            // first bind the location tags to the question
            if(this.selectedCountry == ""){
                alert("Please select country!");
                return;
            }
            // NOTE: cityAutoComplete does not exist if only country is selected           
            if (this.cityAutoComplete != null){
                this.selectedCity = this.cityAutoComplete.query;
         
                if((this.selectedCity!="") && (this.cityAutoComplete.rawList.indexOf(this.selectedCity) == -1)) {
                    alert("Invalid city name!");
                    return;
                }
            }
            var newLocation: string = this.selectedCountry;
            if(this.selectedProvince != ""){
                newLocation = newLocation + '/' + this.selectedProvince;
            }
            if(this.selectedCity != ""){
                newLocation = newLocation + '/' + this.selectedCity;
            }
            // Notice that we do not apend, but replace (Question has a single location)
            this.question.locations = newLocation + ';';
            console.log(this.question.locations);
            // Send Question to Backend
            let path = this.route.snapshot.url.join('/')

            this.questionService.postQuestion(this.question)
            .then(Status => {
                if(Status != 204) {alert("Question could not be sent, please try again");}
                else {alert("Question successfully plasked!");}
            }).then(() => this.router.navigateByUrl(
                '/settings', {skipLocationChange: true})).then(
            () => this.router.navigate([path]));

            // Reset the question bar
            this.question.content = "";
            this.question.services ="";
            this.question.locations="";
            this.questionServiceRefresh();
            this.countryRefresh();

            // Delete only if cityAutoComplete exists
            if(this.cityAutoComplete != null){
                delete this.cityAutoComplete;
            }
            this.selectedCountry="";
            this.selectedProvince="";
            this.selectedCity= "";
            this.provinceList= null;
            this.cityList= null;

        }
    }

    // Methods Related to Location Tags of a Question
    getLocationByName (locList: Location[], name: string): Location {
        for (var i = 0; locList.length > i; i++) {
            if (name.localeCompare (locList[i].loc_name) === 0)
                return locList[i];
        }
        return null;
    }

    countryRefresh(): void {
        this.locationService.getCountryList().then(country => {
                if(0 >= country.length)
                    this.countryList = null;
                else
                    this.countryList = country;
            })
    }

    countrySelect(country: string): void {
        // Guard against selecting dropdown list as option
        if (country == 'Nation'){
            this.selectedCountry = "";
        }
        else{
            this.selectedCountry = country;
        }

        if(country != 'Nation') {
            this.provinceRefresh(this.getLocationByName (this.countryList, country).loc_code);
        } else {
            this.provinceList = null;
        }
        this.cityNameList = [];
        if (this.cityAutoComplete != null){
            delete this.cityAutoComplete;
        }
        this.selectedProvince= "";
        this.selectedCity = "";
    }

    provinceRefresh(country_code: number): void {
        //this.provinceList = provinceListData;
        this.locationService.getLocationList(country_code.toString())
            .then(province => {
                if(province.length <= 0)
                    this.provinceList = null;
                else
                    this.provinceList = province;
            })
    }

    provinceSelect(province: string): void {
        // Allow a user to reset province
        if (province == 'Province'){
            this.selectedProvince = '';
        }
        else{
            this.selectedProvince = province;
        }
        
        if(province != 'Province') {
            this.cityRefresh(this.getLocationByName (this.countryList, this.selectedCountry).loc_code,
                this.getLocationByName (this.provinceList, province).loc_code);
        }
        this.selectedCity = "";
        if (this.cityAutoComplete != null){
            delete this.cityAutoComplete;
        }
        this.cityNameList = [];
    }

    cityRefresh(country_code: number, province_code: number): void {
        var address: string = country_code.toString() + '/' + province_code.toString();
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0)
                    this.cityList = null;
                else {
                    this.cityList = city;
                    this.cityNameList = [];
                    for (var i = 0; i < this.cityList.length; i++)
                        this.cityNameList.push(this.cityList[i].loc_name);
                    this.cityAutoComplete = new AutoCompleteComponent(this.elementRef, this.cityNameList);
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
        if (country == "Nation"){
            this.searchCountry = "";
        }
        else{
            this.searchCountry = country;
        }

        if(country != 'Nation') {
            this.searchProvinceRefresh(this.getLocationByName (this.countryList, country).loc_code);
        } else {
            this.searchProvinceList = null;
        }
        this.searchCityNameList = [];
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
        // Allow a user to reset province
        if (province == 'Province'){
            this.searchProvince = "";
        }
        else{
            this.searchProvince = province;
        }
        if(province != 'Province') {
            this.searchCityRefresh(this.getLocationByName (this.countryList, this.searchCountry).loc_code,
                this.getLocationByName (this.searchProvinceList, province).loc_code);
        }
        this.searchCity = "";
        if(this.searchCityAutoComplete != null){
            delete this.searchCityAutoComplete;
        }
        this.searchCityNameList = [];
    }

    searchCityRefresh(country_code: number, province_code: number): void {
        var address: string = country_code.toString() + '/' + province_code.toString();
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0)
                    this.searchCityList = null;
                else {
                    this.searchCityList = city;
                    this.searchCityNameList = [];
                    for (var i = 0; i < this.searchCityList.length; i++)
                        this.searchCityNameList.push(this.searchCityList[i].loc_name);
                    this.searchCityAutoComplete = new AutoCompleteComponent(this.elementRef, this.searchCityNameList);
                }
            })
    }
    //method called by clicking search button
    search():void {
        let index:Number[] = [-1, -1, -1] // 0:country, 1:province, 2:city code num
        if((this.searchNation == "")){
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
           if(ctry.loc_name === this.searchNation)
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

    notifyWithPermission(title: string, body: string){
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
    }     

}/* istanbul ignore next */


// Mock Data for checking service tag functionality
const serviceListData = [
    'Travel',
    'Cafe',
    'SNU',
    'Pub',
    'Coffee',
    'Museum',
    'Computer',
    'SWPP',
    'Computer',
    'Karaoke',
    'Restaurant',
    'Pasta',
    'Bookstore',
    'Academy',
    'Study',
    'Gym',
];
