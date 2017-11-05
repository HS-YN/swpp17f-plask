//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';

import { UserService } from './user.service';
import { LocationService } from './location.service';

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
    ){ }

    user = new User();
    passwordConfirmation = '';

    userLocationList: string[];
    countryList: string[];
    provinceList: string[];
    cityList: string[];
    serviceList: string[];

    selectedCountry: string = "";
    selectedProvince: string = "";
    selectedCity: string = "";

    ngOnInit(): void{
        this.countryRefresh();
    }

    //Create a new User Account
    SignUp(): void {
        if(this.ValidatePassword()){
            this.userService.signUp(this.user)
                .then(Status => {
                    if(Status == 201) { this.goToMain() }
                    else { alert("You cannot signup with this information.") }
                });
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

    userLocationRefresh(): void {
        if(this.user.locations == "")    return;
        this.userLocationList = this.user.locations
            .substr(0, this.user.locations.length-1).split(';');
    }

    userLocationAdd(): void {
        if(this.selectedCountry == "") {
            alert("Please select country!");
            return;
        }
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
        this.userLocationRefresh();
        this.provinceList = null;
        this.cityList = null;
    }

    userLocationDelete(deleteLocation: string): void {
        deleteLocation = deleteLocation + ';';
        this.user.locations = this.user.locations.replace(deleteLocation, '');
        this.userLocationRefresh();
    }

    countryRefresh(): void {
        this.countryList = countryListData;
    }

    countrySelect(country: string): void {
        this.selectedCountry = country;
        this.provinceRefresh(this.selectedCountry);
        this.cityList = null;
    }

    provinceRefresh(country: string): void {
        this.provinceList = provinceListData;
    }

    provinceSelect(province: string): void {
        this.selectedProvince = province;
        this.cityRefresh(this.selectedProvince);
    }

    cityRefresh(province: string): void {
        this.cityList = cityListData;
    }

    citySelect(city: string): void {
        this.selectedCity = city;
    }

    goToMain(){
        this.router.navigate(['/main']);
    }

    goBack(){
        this.router.navigate(['/signin']);
    }

}

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

const serviceListData = [
    'Travel',
    'Cafe',
    'SNU'
]
