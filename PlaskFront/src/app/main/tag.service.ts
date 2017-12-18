import { Injectable } from '@angular/core';

import { Location } from '../location/location';
import { User } from '../user/user';

import { LocationService } from '../location/location.service';
import { UserService } from '../user/user.service';

import { AutoCompleteComponent } from '../interface/autocomplete.component';

@Injectable()
export class TagService {

    constructor(
        private locationService: LocationService,
        private userService: UserService,
    ) {}

    countryRefresh(): void {
        this.locationService.getCountryList().then(country => {
                if(country.length <= 0)
                    this["countryList"] = null;
                else
                    this["countryList"] = country;
            })
    }

    provinceRefresh(country_code: number, provinceList: string): void {
        this.locationService.getLocationList(country_code.toString())
            .then(province => {
                if(province.length <= 0)
                    this[provinceList] = null;
                else
                    this[provinceList] = province;
            })
    }

    cityRefresh(c_code: number, p_code: number, cityList: string,
        cityAuto: string): void {
        var address: string = c_code.toString() + '/' + p_code.toString();
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0)
                    this[cityList] = null;
                else {
                    this[cityList] = city;
                    var cityNameList = [];
                    for (var i = 0; i < this[cityList].length; i++)
                        cityNameList.push(this[cityList][i].loc_name);
                    this[cityAuto] = new AutoCompleteComponent(
                        this["elementRef"], cityNameList);
                }
            })
    }

    countrySelect(country: string, askCountry: string, askProvince: string,
        askCity: string, provinceList: string, cityAuto: string): void {
        if (country == 'Country'){
            this[askCountry] = "";
            this[provinceList] = null;
        }
        else{
            this[askCountry] = country;
            this.provinceRefresh(this.locationService.getLocationByName (
                this["countryList"], country).loc_code, provinceList);
        }
        if (this[cityAuto] != null){
            delete this[cityAuto];
        }
        this[askProvince]= "";
        this[askCity] = "";
    }

    provinceSelect(province: string, askCountry: string, askProvince: string,
        askCity: string, provinceList: string, cityList: string,
        cityAuto: string): void {
        if (province == 'Province'){
            this[askProvince] = '';
            this[askCity] = "";
            if (this[cityAuto] != null){
                delete this[cityAuto];
            }
        }
        else{
            this[askProvince] = province;
            this[askCity] = "";
            this.cityRefresh(this.locationService.getLocationByName(
                this["countryList"], this[askCountry]).loc_code,
                this.locationService.getLocationByName(
                    this[provinceList], province).loc_code, cityList, cityAuto);
        }
    }

    serviceRefresh(question: string, questionServiceList: string): void {
        if(this[question].services.length <= 1)
            this[questionServiceList] = [];
        else
            this[questionServiceList] = this[question].services
                .substr(1, this[question].services.length-2).split(';');
    }

    serviceDelete(deleteService: string, question: string,
        questionServiceList: string): void {
        deleteService = ';' + deleteService + ';';
        this[question].services = this[question].services
            .replace(deleteService, ';');
        this.serviceRefresh(question, questionServiceList);
    }

    userLocationRefresh(user: string, userLocationList: string): void {
        if(this[user].locations.length <= 1) {
            this[userLocationList] = [];
        }
        else {
            this[userLocationList] = this[user].locations
                .substr(1, this[user].locations.length-2).split(';');
        }
    }

    userLocationDelete(deleteLocation: string, user: string,
        userLocationList: string): void {
        deleteLocation = ';' + deleteLocation + ';';
        this[user].locations = this[user].locations.replace(deleteLocation, ';');
        this.userLocationRefresh(user, userLocationList);
    }

    userLocationAdd(selectedCountry: string, selectedProvince: string,
        selectedCity: string, provinceList: string, cityList: string,
        userLocationList: string, cityAutoComplete: string, user: string): void {
        if(this[selectedCountry] == "") {
            alert("Please select country!");
            return;
        }
        if (this[cityAutoComplete] != null){
            this[selectedCity] = this[cityAutoComplete].query;
            if((this[selectedCity] != "") &&
                (this[cityAutoComplete].rawList.indexOf(this[selectedCity]) == -1)) {
                alert("Invalid city name!");
                this[selectedCity] = "";
                return;
            }
        }
        var newLocation: string = this[selectedCountry];
        if(this[selectedProvince] != "") {
            newLocation = newLocation + '/' + this[selectedProvince];
            if(this[selectedCity] != "")
                newLocation = newLocation + '/' + this[selectedCity];
        }
        if(this[user].locations.indexOf(";"+newLocation+";") != -1) {
            alert("You've already selected " + newLocation + " !")
        }
        else {
            this[user].locations = this[user].locations + newLocation + ';';
            this[selectedCountry] = "";
            this[selectedProvince] = "";
            this[selectedCity] = "";
            if(this[cityAutoComplete] != null){
                delete this[cityAutoComplete];
            }
            this.userLocationRefresh(user, userLocationList);
            this[provinceList] = null;
            this[cityList] = null;
        }
    }

    serviceFetch(serviceList: string, serviceAutoComplete: string,
        blockAutoComplete: string): void {
        this.userService.getService()
            .then(service => {
                if(service.length <= 0)
                    this[serviceList] = [];
                else {
                    this[serviceList] = service;
                    this[serviceAutoComplete] = new AutoCompleteComponent(this["elementRef"], this[serviceList]);
                    this[blockAutoComplete] = new AutoCompleteComponent(this["elementRef"], this[serviceList]);
                    if(service.length >= 10)
                        this[serviceList] = service.slice(0,10);
                }
            })
    }

    blockServiceRefresh(user: string, userBlockedServiceList: string): void {
        if(this[user].blockedServices.length <= 1)
            this[userBlockedServiceList] = [];
        else
            this[userBlockedServiceList] = this[user].blockedServices
                .substr(1, this[user].blockedServices.length-2).split(';');
    }

    blockServiceDelete(deleteService: string, user: string,
        userBlockedServiceList: string): void {
        deleteService = ';' + deleteService + ';';
        this[user].blockedServices = this[user].blockedServices.replace(deleteService, ';');
        this.blockServiceRefresh(user, userBlockedServiceList);
    }

    userServiceSelect(service: string, user: string, userServiceList: string,
        userBlockedServiceList: string): void {
        var validity_check: string = ';' + service + ';';
        if (this[user].services.indexOf(validity_check) != -1){
            alert("Tag Already Added!");
            return;
        }
        else if (this[userBlockedServiceList].indexOf(validity_check) != -1){
            alert("You cannot set same tags on Services and Blocked Services");
            return;
        }
        this[user].services = this[user].services + service + ';';
        this.serviceRefresh(user, userServiceList);
    }

    userServiceAdd(newService: string, user: string, userServiceList: string,
        userBlockedServiceList: string, serviceAutoComplete: string,
        serviceList: string): void {
        this[newService] = this[serviceAutoComplete].query;
        if(this[newService] == ""){
            alert("Tag is Empty!");
        }
        else if (this[newService].indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this[serviceList].indexOf(this[newService]) != -1){
            alert("Why don't you select from the list above?");
        }
        else if (this[newService].length >= 100) {
            alert("Tag length should be less than 100 characters.")
        }
        else{
            this.userServiceSelect(this[newService], user, userServiceList,
                userBlockedServiceList);
            this[newService] = "";
            this[serviceAutoComplete].query = "";
        }
    }

    userBlockedServiceAdd(newBlockService: string, user: string,
        userServiceList: string, userBlockedServiceList: string,
        blockAutoComplete: string): void {
        this[newBlockService] = this[blockAutoComplete].query;
        if(this[newBlockService] == ""){
            alert("Tag is Empty!");
        }
        else if (this[newBlockService].indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this[userServiceList].indexOf(this[newBlockService]) != -1){
            alert("You cannot set same tags on Services and Blocked Services");
        }
        else if (this[userBlockedServiceList].indexOf(this[newBlockService]) != -1){
            alert("Tag already Exists!");
        }
        else if (this[newBlockService].length >= 100) {
            alert("Tag length should be less than 100 characters.")
        }
        else{
            this[user].blockedServices = this[user].blockedServices + this[newBlockService] + ';';
            this.blockServiceRefresh(user, userBlockedServiceList);
            this[newBlockService] = "";
            this[blockAutoComplete].query = "";
        }
    }
}
