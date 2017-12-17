

import { Location } from '../location/location';

export class MainService {
    constructor(){}

    getLocationByName (locList: Location[], name: string): Location {
        for (var i = 0; i < locList.length; i++) {
            if (name.localeCompare(locList[i].loc_name) === 0)
                return locList[i];
        }
        return null;
    }
}
