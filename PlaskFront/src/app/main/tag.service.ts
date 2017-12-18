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
        if(this[question].services == "")
            this[questionServiceList] = null;
        else
            this[questionServiceList] = this[question].services
                .substr(0, this[question].services.length-1).split(';');
    }

    serviceDelete(deleteService: string, question: string,
        questionServiceList: string): void {
        deleteService = deleteService + ';';
        this[question].services = this[question].services.replace(deleteService, '');
        this.serviceRefresh(question, questionServiceList);
    }
}
