//Import Basic Modules
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user/user';
import { Location } from '../location/location';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { TagService } from '../main/tag.service';

import { AutoCompleteComponent } from '../interface/autocomplete.component';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: [ './signup.component.css']
})

export class SignUpComponent implements OnInit {

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
        private tagService: TagService,
        private elementRef: ElementRef,
    ) {}

    user = new User();
    passwordConfirmation = ''; //string for password Matching

    countryList: Location[];
    provinceList: Location[];
    cityList: Location[];
    serviceList: string[] = [];
    notiFrequencyList: number[] = [];

    selectedCountry: string = "";
    selectedProvince: string = "";
    selectedCity: string = "";
    newService: string = '';
    newBlockService: string = '';
    selectedFreq:number;
    //visualization of list
    userLocationList: string[];
    userServiceList: string[] = [];
    userBlockedServiceList: string[] = [];

    cityAutoComplete: AutoCompleteComponent;
    serviceAutoComplete: AutoCompleteComponent;
    blockAutoComplete: AutoCompleteComponent;

    ngOnInit(): void{
        this.userService.checkSignedIn().then(status => {
            if(status == 'True')    this.router.navigate(['/main']);
        })
        this.countryRefresh();
        this.serviceRefresh();
        this.notiFrequencyList = [10, 20, 30, 60, 120]
        this.selectedFreq = this.notiFrequencyList[0];
    }

    //Methods for Location Tags
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
    //Update location tag visualization
    userLocationRefresh(): void {
        if(this.user.locations == "") {
            this.userLocationList = null;
        }
        else {
            this.userLocationList = this.user.locations
                .substr(0, this.user.locations.length-1).split(';');
        }
    }

    userLocationAdd(): void {
        if(this.selectedCountry == "") {
            alert("Please select country!");
            return;
        }
        if (this.cityAutoComplete != null){
            this.selectedCity = this.cityAutoComplete.query;
            if((this.selectedCity!="") &&
                (this.cityAutoComplete.rawList.indexOf(this.selectedCity) == -1)) {
                alert("Invalid city name!");
                this.selectedCity = "";
                return;
            }
        }
        var newLocation: string = this.selectedCountry;
        if(this.selectedProvince != "") {
            newLocation = newLocation + '/' + this.selectedProvince;
            if(this.selectedCity != "")
                newLocation = newLocation + '/' + this.selectedCity;
        }
        if(this.user.locations.indexOf(newLocation+";") != -1) {
            alert("You've already selected " + newLocation + " !")
        }
        else {
            this.user.locations = this.user.locations + newLocation + ';';
            this.selectedCountry = "";
            this.selectedProvince = "";
            this.selectedCity = "";
            if(this.cityAutoComplete != null){
                delete this.cityAutoComplete;
            }
            this.userLocationRefresh();
            this.provinceList = null;
            this.cityList = null;
        }
    }

    userLocationDelete(deleteLocation: string): void {
        deleteLocation = deleteLocation + ';';
        this.user.locations = this.user.locations.replace(deleteLocation, '');
        this.userLocationRefresh();
    }

    //Methods for Service Tags

    //Update service tag visualization
    userServiceRefresh(): void {
        if(this.user.services == '') {
            this.userServiceList = [];
            return;
        }
        this.userServiceList = this.user.services
            .substr(0, this.user.services.length-1).split(';');
    }//DUplicate

    serviceRefresh(): void {
        this.userService.getService()
            .then(service => {
                if(service.length <= 0)
                    this.serviceList = null;
                else {
                    this.serviceList = service;
                    this.serviceAutoComplete = new AutoCompleteComponent(this.elementRef, this.serviceList);
                    this.blockAutoComplete = new AutoCompleteComponent(this.elementRef, this.serviceList);
                    if(service.length >= 10)
                        this.serviceList = service.slice(0,10);
                }
            })
    }

    //Select a Tag from the exisitng list of service tags
    userServiceSelect(service: string): void {
        var validity_check: string = service + ';';
        if (this.user.services.indexOf(validity_check) != -1){
            alert("Tag Already Added!");
            return;
        }
        else if (this.userBlockedServiceList.indexOf(service) != -1){
            alert("You cannot set same tags on Services and Blocked Services");
            return;
        }
        this.user.services = this.user.services + service + ';';
        this.userServiceRefresh();
    }

    userServiceDelete(deleteService: string): void {
        deleteService = deleteService + ';';
        this.user.services = this.user.services.replace(deleteService, '');
        this.userServiceRefresh();
    }//duplicate

    userServiceAdd(): void {
        this.newService = this.serviceAutoComplete.query;
        if(this.newService == ""){
            alert("Tag is Empty!");
        }
        else if (this.newService.indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this.serviceList.indexOf(this.newService) != -1){
            alert("Tag already Exists!");
        }
        else if (this.newService.length >= 100) {
            alert("Tag length should be less than 100 characters.")
        }
        else{
            this.userServiceSelect(this.newService);
            this.newService = "";
            this.serviceAutoComplete.query = "";
        }
    }


    //Methods For Blocked Service Tags
    userBlockedServiceDelete(deleteService: string): void {
        deleteService = deleteService + ';';
        this.user.blockedServices = this.user.blockedServices.replace(deleteService, '');
        this.userBlockedServiceRefresh();
    }//duplicate

    userBlockedServiceAdd(): void {
        this.newBlockService = this.blockAutoComplete.query;
        if(this.newBlockService == ""){
            alert("Tag is Empty!");
        }
        else if (this.newBlockService.indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this.userServiceList.indexOf(this.newBlockService) != -1){
            alert("You cannot set same tags on Services and Blocked Services");
        }
        else if (this.userBlockedServiceList.indexOf(this.newBlockService) != -1){
            alert("Tag already Exists!");
        }
        else if (this.newBlockService.length >= 100) {
            alert("Tag length should be less than 100 characters.")
        }
        else{
            this.user.blockedServices = this.user.blockedServices + this.newBlockService + ';';
            this.userBlockedServiceRefresh();
            this.newBlockService = "";
            this.blockAutoComplete.query = "";
        }
    }
    userBlockedServiceRefresh(): void {
        if(this.user.blockedServices == '') {
            this.userBlockedServiceList = [];
            return;
        }
        this.userBlockedServiceList = this.user.blockedServices
        .substr(0, this.user.blockedServices.length-1).split(';');
    }//dupliate
    //Method for setting notification frequency
    userNotiFrequencySelect(freq: number): void {
        this.user.notiFrequency = freq;
        this.userBlockedServiceRefresh();
    }

    SignUp(): void {
        var email_check = new RegExp('^[^ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff@]+@[^ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\\.@]+\\.[a-z]{2,3}$')
        if(this.user.email.length >= 100 || !email_check.test(this.user.email)) {
            alert("Invalid email address!");
        }
        else if(this.user.password == this.passwordConfirmation){
            if (this.user.locations == ""){
                alert("You need to add at least one location!");
            }
            else if(this.user.services == ""){
                alert("You need to add at least one service");
            }
            else {
                this.userService.signUp(this.user)
                    .then(Status => {
                        if(Status == 201) {
                            alert("Successfully signed up! Please sign in.");
                            this.goBack()
                        }
                    }).catch((err) => {
                        alert("You cannot signup with this information.");
                    });
            }
        }
        else{
            alert ("Password is Different!")
        }
    }


    goToMain(){
        this.router.navigate(['/main']);
    }

    goBack(){
        this.router.navigate(['/signin']);
    }

    onChange(freq) {
        this.user.notiFrequency = freq;
    }
} /* istanbul ignore next */
