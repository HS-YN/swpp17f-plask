//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user/user';
import { Question } from '../question/question';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service'; 
import { QuestionService } from '../question/question.service';

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.css']
})
export class MainComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
    ){ }

    question:Question = {id:0, content:"", author:"", locations:"", services:""};

    countryList: string[];
    provinceList: string[];
    cityList: string[];

    selectedCountry: string = "";
    selectedProvince: string = "";
    selectedCity: string = "";


    serviceList: string[]; //List of service tags from Backend
    questionServiceList: string[]; //List for visualizing current question service tags
    serviceTag: string = ''; //User-input string

    ngOnInit(): void{
        
        this.userService.getUser().then(user => {
            if(user != null){ this.question.author = user.username; this.countryRefresh(); this.serviceRefresh();}
            else{ this.router.navigate(['/signin']); }
        })
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
            var newLocation: string = this.selectedCountry;
            if(this.selectedProvince != "")    newLocation = newLocation + '/' + this.selectedProvince;
            if(this.selectedCity != "")    newLocation = newLocation + '/' + this.selectedCity;

            // Notice that we do not apend, but replace (Question has a single location)
            this.question.locations = newLocation + ';';

            // Send Question to Backend
            this.questionService.postQuestion(this.question)
            .then(Status => { 
                if(Status != 201) {alert("Question could not be sent, please try again");}});

            alert("Question successfully plasked!");

            // Reset the question bar
            this.question.content = "";
            this.question.services ="";
            this.question.locations="";
            this.questionServiceRefresh();
            this.countryRefresh();

            this.selectedCountry="";
            this.selectedProvince="";
            this.selectedCity= "";
            this.provinceList= null;
            this.cityList= null;
            
        }
    }

    // Methods Related to Location Tags of a Question
    countryRefresh(): void {
        this.locationService.getCountryList().then(country => {
            if(country.length <= 0) this.countryList = null;
            else    this.countryList = country.substr(0, country.length-1)
                .split(';');
        })
    }

    countrySelect(country: string): void {
        this.selectedCountry = country;
        this.provinceRefresh(this.selectedCountry);
        this.cityList = null;
        this.selectedProvince = "";
        this.selectedCity = "";
    }

    provinceRefresh(country: string): void {
        //this.provinceList = provinceListData;
        this.locationService.getLocationList(this.selectedCountry)
            .then(province => {
                if(province.length <= 0) this.provinceList = null;
                else    this.provinceList = province
                    .substr(0,province.length-1).split(';');
            })
    }

    provinceSelect(province: string): void {
        this.selectedProvince = province;
        this.cityRefresh(this.selectedProvince);
        this.selectedCity = "";
    }

    cityRefresh(province: string): void {
        //this.cityList = cityListData;
        var address: string = this.selectedCountry + '/' + this.selectedProvince;
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0) this.cityList = null;
                else    this.cityList = city.substr(0,city.length-1).split(';');
            })
    }

    //Update service tag visualization
    serviceRefresh(): void {
        //TODO: replace serviceListData with serviceService
        this.serviceList = serviceListData;
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
        if(this.serviceTag == ""){
            alert("Tag is Empty!");
        }
        else if (this.serviceTag.indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else{
            this.questionServiceSelect(this.serviceTag);
            this.serviceTag = "";
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
