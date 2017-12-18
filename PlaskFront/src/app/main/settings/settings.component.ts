import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../user/user';
import { Location } from '../../location/location';

import { UserService } from '../../user/user.service';
import { LocationService } from '../../location/location.service';
import { TagService } from '../../main/tag.service';

import { AutoCompleteComponent } from '../../interface/autocomplete.component';

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
        private tagService: TagService,
        private elementRef: ElementRef,
    ) {}

    user: User = new User();
    newpassword= "";
    passwordConfirmation = "";

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
        this.notiFrequencyList = [10, 20, 30, 60, 120];
        this.userService.getUser().then(User => {
           this.user = User;
           this.countryRefresh();
           this.serviceFetch("serviceList", "serviceAutoComplete",
            "blockAutoComplete");
           this.userLocationRefresh('user', 'userLocationList');
           this.userBlockedServiceRefresh();
           this.serviceRefresh("user", "userServiceList");
           this.selectedFreqRefresh();
       });
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

    userLocationRefresh: (user: string,
        userLocationList: string) => void = this.tagService.userLocationRefresh;

    userLocationDelete:(deleteLocation: string, user: string,
        userLocationList: string) => void = this.tagService.userLocationDelete;

    userLocationAdd: (selectedCountry: string, selectedProvince: string,
        selectedCity: string, provinceList: string, cityList: string,
        userLocationList: string, cityAutoComplete: string,
        user: string) => void = this.tagService.userLocationAdd;

    //Methods for Service Tags

    serviceFetch: (serviceList: string, serviceAutoComplete: string,
        blockAutoComplete: string) => void = this.tagService.serviceFetch;

    serviceRefresh: (question: string,
        questionServiceList: string) => void = this.tagService.serviceRefresh;

    serviceDelete: (deleteService: string, question: string,
        questionServiceList: string) => void = this.tagService.serviceDelete;
    //Select a Tag from the exisitng list of service tags
    userServiceSelect(service: string): void {
        var validity_check: string = service + ';';
        if (this.user.services.indexOf(validity_check) != -1){
            alert("Tag Already Added!");
            return;
        }
        this.user.services = this.user.services + service + ';';
        this.serviceRefresh("user", "userServiceList");
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

    //Codes for Blocked Services
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
    userBlockedServiceDelete(deleteService: string): void {
        deleteService = deleteService + ';';
        this.user.blockedServices = this.user.blockedServices.replace(deleteService, '');
        this.userBlockedServiceRefresh();
    }
    //Method for setting notification frequency
    onChange(freq) {
        this.user.notiFrequency = freq;
    }

    selectedFreqRefresh(){
        var x:number = this.notiFrequencyList.indexOf(this.user.notiFrequency);
        if(x == -1)    x = 0;
        this.selectedFreq = this.notiFrequencyList[x];
    }

    SaveChanges(): void {
        if(this.newpassword != this.passwordConfirmation) {
            alert("Password is different.")
        }
        else if(this.user.locations == ""){
            alert("You need to have at least one location tag!");
        }
        else if (this.user.services == ""){
            alert("You need to have at least one service tag!");
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

    goToMain(){
        this.router.navigate(['/main']);
    }

    goBack(){
        this.router.navigate(['/signin']);
    }

    goToSignin(){
        this.router.navigate(['/signin']);
    }
} /* istanbul ignore next */
