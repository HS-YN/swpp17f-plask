//Import Basic Modules
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user/user';
import { Location } from '../location/location';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';

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
        private elementRef: ElementRef,
    ){ }

    user = new User();
    passwordConfirmation = ''; //string for password Matching

    userLocationList: string[]; //List for visualizing current user location tags
    countryList: Location[];
    provinceList: Location[];
    cityList: Location[];
    cityAutoComplete: AutoCompleteComponent;

    selectedCountry: string = "";
    selectedProvince: string = "";
    selectedCity: string = "";


    serviceList: string[] = []; //List of service tags from Backend
    userServiceList: string[] = []; //List for visualizing current user service tags
    newService: string = ''; //User-input string
    serviceAutoComplete: AutoCompleteComponent;
    userBlockedServiceList: string[] = []; //List for visualizing current user blocked service tags
    newBlockService: string = '';
    blockAutoComplete: AutoCompleteComponent;
    notiFrequencyList: number[] = []; //List of frequency selection
    selectedFreq:number;


    ngOnInit(): void{
        this.userService.checkSignedIn().then(status => {
            if(status == 'True')    this.router.navigate(['/main']);
        })
        this.countryRefresh();
        this.serviceRefresh();
        this.notiFrequencyList = [10, 20, 30, 60, 120]
        this.selectedFreq = this.notiFrequencyList[0];
    }

    //Create a new User Account
    SignUp(): void {
        var email_check = new RegExp('^[^ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff@]+@[^ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\\.@]+\\.[a-z]{2,3}$')
        if(this.user.email.length >= 100 || !email_check.test(this.user.email)) {
            alert("Invalid email address!");
            return;
        }
        if(this.ValidatePassword()){
            this.userService.signUp(this.user)
                .then(Status => {
                    if(Status == 201) {
                        alert("Successfully signed up! Please sign in.");
                        this.goBack()
                    }
                }).catch((err) => {alert("You cannot signup with this information.");});
        }
        else{
            alert ("Password is Different!")
        }
    }

    //Validate Password Match
    ValidatePassword(): boolean {
        if (this.user.password == this.passwordConfirmation){
            return true;
        }
        else{
            return false;
        }
    }

    //Methods for Location Tags

    //Update location tag visualization
    userLocationRefresh(): void {
        if(this.user.locations == "") {
            this.userLocationList = null;
            return;
        }
        this.userLocationList = this.user.locations
            .substr(0, this.user.locations.length-1).split(';');
    }

    userLocationAdd(): void {
        if(this.selectedCountry == "") {
            alert("Please select country!");
            return;
        }
        this.selectedCity = this.cityAutoComplete.query;
        var newLocation: string = this.selectedCountry;
        if(this.selectedProvince != "")    newLocation = newLocation + '/' + this.selectedProvince;
        if(this.selectedCity != "")    newLocation = newLocation + '/' + this.selectedCity;

        if(this.user.locations.indexOf(newLocation+";") != -1) {
            alert("You've already selected " + newLocation + " !")
            return;
        }

        this.user.locations = this.user.locations + newLocation + ';';
        this.selectedCountry = "";
        this.selectedProvince = "";
        this.selectedCity = "";
        delete this.cityAutoComplete;
        this.userLocationRefresh();
        this.provinceList = null;
        this.cityList = null;
    }

    userLocationDelete(deleteLocation: string): void {
        deleteLocation = deleteLocation + ';';
        this.user.locations = this.user.locations.replace(deleteLocation, '');
        this.userLocationRefresh();
    }

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
        this.selectedCountry = country;
        this.provinceRefresh(this.getLocationByName (this.countryList, country).loc_code);
        this.cityList = null;
        this.selectedProvince = "";
        this.selectedCity = "";
        delete this.cityAutoComplete;
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
        this.selectedProvince = province;
        this.cityRefresh(this.getLocationByName (this.countryList, this.selectedCountry).loc_code,
            this.getLocationByName (this.provinceList, province).loc_code);
        this.selectedCity = "";
    }

    cityRefresh(country_code: number, province_code: number): void {
        //this.cityList = cityListData;
        var address: string = country_code.toString() + '/' + province_code.toString();
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0)
                    this.cityList = null;
                else {
                    this.cityList = city;
                    var cList = [];
                    for (var i = 0; i < this.cityList.length; i++)
                        cList.push(this.cityList[i].loc_name);
                    this.cityAutoComplete = new AutoCompleteComponent(this.elementRef, cList);
                }
            })
    }

    citySelect(): void {
        this.selectedCity = this.cityAutoComplete.query;
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
    }

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
    }

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
    }

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
    }

    //Method for setting notification frequency
    userNotiFrequencySelect(freq: number): void {
        this.user.notiFrequency = freq;
        this.userBlockedServiceRefresh();
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
/*
    angular.module('ngrepeatSelect', [])
    .controller('ExampleController', ['$scope', function($scope) {
        $scope.data = {
            model: null,
            availableOptions: [
                {id: '1', name: 'Option A'},
                {id: '2', name: 'Option B'},
                {id: '3', name: 'Option C'}
            ]
        };
    }]);
*/
} /* istanbul ignore next */

/*
// Mock data for checking location tag functionality
const countryListData = [
    'South Korea',
    'Japan',
    'France',
    'Russia'
]

const provinceListData = [
    'Seoul',
    'Busan',
    'Gyeonggi-do'
]

const cityListData = [
    'Gwanak',
    'Gangseo',
    'Gangnam'
]
*/
// Mock Data for checking service tag functionality
const serviceListData = [
    'Travel',
    'Cafe',
    'SNU',
    'Pub',
]
