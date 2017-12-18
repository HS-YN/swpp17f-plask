export class User{

    email: string;
    password: string;
    username: string;
    //Tags saved in Parsed Format
    locations: string = ";";
    services: string = ";";
    blockedServices: string = ";";

    notiFrequency: number = 1;
}
