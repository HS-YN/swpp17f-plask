//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../user/user';

import { UserService } from '../../user/user.service';
import { LocationService } from '../../location/location.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: [ './settings.component.css']
})
export class SettingsComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
    ){ }

    user: User = new User();
    newpassword= ""; //string for new password
    passwordConfirmation = ""; //string for password Matching

    userLocationList: string[]; //List for visualizing current user location tags
    countryList: string[];
    provinceList: string[];
    cityList: string[];

    selectedCountry: string = "";
    selectedProvince: string = "";
    selectedCity: string = "";


    serviceList: string[]; //List of service tags from Backend
    userServiceList: string[]; //List for visualizing current user service tags
    newService: string = ''; //User-input string




    ngOnInit(): void{
        this.userService.getUser().then(User => {
            this.user = User;
            this.countryRefresh();
            this.serviceRefresh();
            this.userLocationRefresh();
            this.userServiceRefresh();
           // if(user == null)    this.router.navigate(['/signin']);
        });


    }

    //TODO: Deal with Password Change

    SaveChanges(): void {
        if(this.newpassword != this.passwordConfirmation) {
            alert("Password is different.")
            return
        }
        else if(this.newpassword != "") {
            this.user.password = this.newpassword;
            alert("Successfully changed password. Please sign in again.")
            this.userService.update(this.user)
                .then(() => this.goToSignin());
        }
        else {
            alert("Successfully modified!")
            this.userService.update(this.user)
            .then(() => this.goToMain());
        }
    }



    //Validate Password Match
/*    ValidatePassword(): boolean {
        //change to new password
        if (this.newpassword !=""){
            if (this.newpassword == this.passwordConfirmation){
                this.user.password = this.newpassword;
                return true
            }
            else{
                return false;
            }
        }
        //No change in password
        else{
            return true;
        }
    }*/


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
        //this.countryList = countryListData;
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

    citySelect(city: string): void {
        this.selectedCity = city;
    }


    //Methods for Service Tags

    //Update service tag visualization
    userServiceRefresh(): void {
        if(this.user.services == '') {
            this.userServiceList = null;
            return;
        }
        this.userServiceList = this.user.services
            .substr(0, this.user.services.length-1).split(';');
    }

    serviceRefresh(): void {
        //TODO: replace serviceListData with serviceService
        this.serviceList = serviceListData;
    }

    //Select a Tag from the exisitng list of service tags
    userServiceSelect(service: string): void {
        var validity_check: string = service + ';';
        if (this.user.services.indexOf(validity_check) != -1){
            alert("Tag Already Added!");
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
        if(this.newService == ""){
            alert("Tag is Empty!");
        }
        else if (this.newService.indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this.serviceList.indexOf(this.newService) != -1){
            alert("Tag already Exists!");
        }
        else{
            this.userServiceSelect(this.newService);
            this.newService = "";
        }
    }

    goToMain(){
        this.router.navigate(['/main']);
    }

    goToSignin(){
        this.router.navigate(['/signin']);
    }




} /* istanbul ignore next */

// Mock Data for checking service tag functionality
const serviceListData = [
    'Travel',
    'Cafe',
    'SNU',
    'Pub',
]
