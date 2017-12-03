//Import Basic Modules
import { Component, OnInit, HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user/user';
import { Question } from '../question/question';
import { Location } from '../location/location';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { QuestionService } from '../question/question.service';

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
    ){ }

    question:Question = {id:0, content:"", author:"", locations:"", services:""};

    countryList: Location[];
    provinceList: Location[];
    cityList: Location[];
    cityNameList: string[];

    selectedCountry: string = "";
    selectedProvince: string = "";
    selectedCity: string = "";

    serviceList: string[]; //List of service tags from Backend
    questionServiceList: string[]; //List for visualizing current question service tags
    serviceTag: string = ""; //User-input string

    //variables for searching
    searchString: string = "";
    searchCountry: string = "";
    searchNation: string = "";
    searchProvince: string = "";
    searchCity: string = "";
    searchCityNameList: string[];
    searchProvinceList: Location[];
    searchCityList: Location[]; //use this to find location code

    ngOnInit(): void{
        this.userService.getUser().then(user => {
            this.question.author = user.username;
            this.countryRefresh();
            this.serviceRefresh();
            // Notification Method
            this.notify("Plask!", "Thank you! You can now receive notifications :)");            
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
            var newLocation: string = this.selectedCountry;
            if(this.selectedProvince != "")    newLocation = newLocation + '/' + this.selectedProvince;
            if(this.selectedCity != "")    newLocation = newLocation + '/' + this.selectedCity;

            // Notice that we do not apend, but replace (Question has a single location)
            this.question.locations = newLocation + ';';

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
        this.selectedCountry = country;
        this.provinceRefresh(this.getLocationByName (this.countryList, country).loc_code);
        this.cityList = null;
        this.selectedProvince = "";
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
                else
                    this.cityList = city;
                this.cityNameList = [];
                for (var i = 0; i < this.cityList.length; i++)
                    this.cityNameList.push(this.cityList[i].loc_name);
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
    //Methods for searching, with tagging location
    countrySearch(country: string): void {
        this.searchCountry = country;
        this.searchProvinceRefresh(this.getLocationByName (this.countryList, country).loc_code);
        this.searchCityNameList = [];
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
        this.searchProvince = province;
        this.searchCityRefresh(this.getLocationByName (this.countryList, this.searchCountry).loc_code, 
            this.getLocationByName (this.searchProvinceList, province).loc_code);
        this.searchCity = "";
    }

    searchCityRefresh(country_code: number, province_code: number): void {
        //this.cityList = cityListData;
        var address: string = country_code.toString() + '/' + province_code.toString();
        this.locationService.getLocationList(address)
            .then(city => {
                if(city.length <= 0)
                    this.searchCityList = null;
                else
                    this.searchCityList = city;
                this.searchCityNameList = [];
                for (var i = 0; i < this.searchCityList.length; i++)
                    this.searchCityNameList.push(this.searchCityList[i].loc_name);
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
        if (!target.closest(".dropdown")) {
            document.getElementById("myDropdown").classList.toggle("show", false);
        }

    }
}
/* istanbul ignore next */


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
