import { User } from "../user/user";

export class Question{

    id: number;
    content: string ='';
    author: string ='';
    //Tags saved in Parsed Format
    locations: string ='';
    services: string ='';
    select_id: number;
    time: string='';

    //TODO: Determine if we need to add Question member

}
