import { Component, OnInit, HostListener } from '@angular/core';
import { ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user/user';
import { Question } from '../question/question';
import { Location } from '../location/location';
import { Answer } from '../answer/answer';

import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { QuestionService } from '../question/question.service';
import { AnswerService  } from '../answer/answer.service';
import { TagService } from './tag.service';

import { AutoCompleteComponent } from '../interface/autocomplete.component';

declare var Notification: any;

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.css'],
})

export class MainComponent implements OnInit, OnDestroy{

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
        private tagService: TagService,
        private elementRef: ElementRef,
        private answerService: AnswerService,
    ){ }

    user:User = new User();
    question:Question = {id:0, content:"", author:"", locations:"",
    services:"", select_id:-1, time:""};

    countryList: Location[];
    provinceList: Location[];
    cityList: Location[];
    serviceList: string[]; //List of service tags from Backend
    searchProvinceList: Location[];
    searchCityList: Location[]; //use this to find location code

    askCountry: string = "";
    askProvince: string = "";
    askCity: string = "";

    questionServiceList: string[]; //List for current question service tags
    serviceTag: string = ""; //User-input string

    searchString: string = "";
    searchCountry: string = "";
    searchProvince: string = "";
    searchCity: string = "";
    searchIndex:string[];

    cityAutoComplete: AutoCompleteComponent;
    serviceAutoComplete: AutoCompleteComponent;
    searchCityAutoComplete: AutoCompleteComponent;

    socket: WebSocket;

    //variables for question list
    questionList: [Question, boolean, Answer[], string][];
    answer:string = "";
    chooseAnswerEnable: boolean = false;
    tabNum:number; //stores current tab's number

    ngOnInit(): void{
        this.userService.getUser().then(user => {
            this.user = user;
            this.question.author = user.username;
            this.countryRefresh();
            this.serviceFetch();
            // Send welcome message :)
            this.notify("Plask!", "Thank you! You can now receive notifications :)");
            // Connect to websocket & Listen for messages
            this.socket = new WebSocket("ws://localhost:8000/notification");
            this.socket.addEventListener('message', this.receiveAndNotify);
        });
        this.getQuestionList(1);
        this.tabNum = 1;
    }

    ngOnDestroy(): void {
        this.socket.removeEventListener('message', this.receiveAndNotify);
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
        }//Do not request for permission if either already "granted" or "denied"
    }

    receiveAndNotify (event) {
        if (Notification.permission === "granted"){
            var options = {
                body: "Answer has arrived!\n" + event.data,
            }
        var notification = new Notification("Plask!", options);
        setTimeout(notification.close.bind(notification), 5000);
        }
    }

    // Location & Service Tags

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
    //Update service tag visualization
    serviceFetch(): void {
        this.userService.getService()
            .then(service => {
                if(service.length <= 0)
                    this.serviceList = null;
                else {
                    this.serviceList = service;
                    this.serviceAutoComplete = new AutoCompleteComponent(
                        this.elementRef, this.serviceList);
                }
            })
    }

    serviceRefresh: (question: string,
        questionServiceList: string) => void = this.tagService.serviceRefresh;

    serviceDelete: (deleteService: string, question: string,
        questionServiceList: string) => void = this.tagService.serviceDelete;

    serviceAdd(serviceTag: string, serviceAutoComplete: string,
        question: string, questionServiceList: string): void {
        this[serviceTag] = this[serviceAutoComplete].query;
        if(this[serviceTag] == ""){
            alert("Tag is Empty!");
        }
        else if (this[serviceTag].indexOf(";") != -1){
            alert("You cannot use SemiColon!");
        }
        else if (this[serviceTag].length >= 100) {
            alert("Tag length should be less than 100 characters.")
        }
        else{
            this.serviceSelect(this[serviceTag], question, questionServiceList);
            this[serviceTag] = "";
            this[serviceAutoComplete].query = "";
        }
    }
    //Subroutine of questionServiceAdd: actual append happens here
    serviceSelect(service: string, question: string,
        questionServiceList: string): void {
        var validity_check: string = service + ';';
        if (this[question].services.indexOf(validity_check) != -1){
            alert("Tag Already Added!");
        }
        else {
            this[question].services = this[question].services + service + ';';
            this.serviceRefresh(question, questionServiceList);
        }
    }

    // Send & Search

    sendQuestion(): void{
        if(this.question.content == ""){
            alert("Question is Empty!");
        }
        else{
            if(this.askCountry == ""){
                alert("Please select country!");
                return;
            }
            if (this.cityAutoComplete != null){
                this.askCity = this.cityAutoComplete.query;
                if((this.askCity!="") &&
                    (this.cityAutoComplete.rawList.indexOf(this.askCity)==-1)) {
                    alert("Invalid city name!");
                    return;
                }
            }

            var newLocation: string = this.askCountry;
            if(this.askProvince != ""){
                newLocation = newLocation + '/' + this.askProvince;
                if(this.askCity != ""){
                    newLocation = newLocation + '/' + this.askCity;
                }
            }
            this.question.locations = newLocation + ';';

            let path = this.route.snapshot.url.join('/')
            this.questionService.postQuestion(this.question)
            .then(Status => {
                if(Status != 204) {
                    alert("Question could not be sent, please try again");
                }
                else {
                    alert("Question successfully plasked!");
                }
            }).then(() => this.router.navigateByUrl(
                '/blank', {skipLocationChange: true})).then(
            () => this.router.navigate([path]));
            this.refreshNewQuestion();
        }
    }

    /* function for refreshing all inputs for new question */
    refreshNewQuestion():void {
        this.question.content = "";
        this.question.services = "";
        this.question.locations = "";
        this.serviceRefresh("question", "questionServiceList");
        this.countryRefresh();
        if(this.cityAutoComplete != null){
            delete this.cityAutoComplete;
        }
        this.askCountry = "";
        this.askProvince = "";
        this.askCity = "";
        this.provinceList = null;
        this.cityList = null;
    }

    search():void {
        this.searchIndex = ["-1","-1","-1"]; // [country, province, city code]
        if((this.searchCountry == "")){
            alert("Please select country tag!");
            return;
        }
        if(this.searchString == ""){
            alert("Please fill content before searching!");
            return;
        }
        if(this.searchCityAutoComplete != null ){
            this.searchCity = this.searchCityAutoComplete.query;
            if((this.searchCity != "") && (this.searchCityAutoComplete.rawList.
                indexOf(this.searchCity) == -1)){
                alert("Invalid city name!");
                return;
            }
        }
        for(let ctry of this.countryList){
           if(ctry.loc_name === this.searchCountry)
               this.searchIndex[0] = ctry.loc_code.toString();
        }
        if(this.searchProvince != "")
            for(let prvc of this.searchProvinceList){
                if(prvc.loc_name === this.searchProvince)
                    this.searchIndex[1] = prvc.loc_code.toString();
            }
        if(this.searchCity != "")
            for(let cty of this.searchCityList){
                if(cty.loc_name === this.searchCity)
                    this.searchIndex[2] = cty.loc_code.toString();
            }
        this.questionService.getSearchedQuestion(this.searchString, this.searchIndex).then(questions => {
            this.questionList = [];
            for(let q of questions){
                let str = q.time;
                let splitted = str.split(".");
                this.questionList.push([q, true, [], splitted[0]]);
            }
            if(this.questionList.length===0){
                alert("No Question Matched!");
                this.refreshSearchQuestion();
                this.getQuestionList(1);
            }
            else{
                alert("Search Completed!");
                this.tabNum = 4;
            }
        });
    }
    //Open Plask Question Dropdown when clicked
    myFunction():void {
            document.getElementById("myDropdown").classList.toggle("show");
    }
    //Close when somewhere else is clicked
    @HostListener('document:click', ['$event'])
    onClick(event) {
        var target = event.target;
        if (!target.closest(".dropdown") && !target.closest(".container") && !target.closest(".suggestions")) {
            document.getElementById("myDropdown").classList.toggle("show", false);
        }
    }

    goToSettings(): void{
         this.router.navigate(['/settings']);
    }

    goSignOut(): void{
        this.userService.signOut().then(() => this.router.navigate(['/signin']));
    }

    /*
     * Codes for question list display
     */
    refresh():void{
        this.getQuestionList(this.tabNum);
    }
    refreshSearchQuestion():void{
        this.searchString = "";
        this.searchCountry = "";
        this.searchProvince = "";
        this.searchCity = "";
        this.searchIndex = [];
    }
    getQuestionList(tabnum:number):void {
        this.refreshNewQuestion();
        this.questionList = [];
        let getQfunction:Promise<Question[]>;
        /* for clicking/refreshing/answering main/myq/mya */
        if(tabnum != 4){
            getQfunction = this.questionService.getQuestion(tabnum);
            if(this.tabNum == 4){ //for clicking other tab from searchtab, reset searching info
                this.refreshSearchQuestion();
            }
        }
        /*for refreshing/answering in search tab*/
        else{
            getQfunction = this.questionService.getSearchedQuestion(this.searchString, this.searchIndex);
        }
        this.tabNum = tabnum;
        getQfunction.then(questions =>{
            for(let q of questions){
                let str = q.time;
                let splitted = str.split(".");
                this.questionList.push([q, true, [], splitted[0]]);
            }
        });
    }
    
    getAnswer(qid:number, qindex:number){
        this.answerService.getAnswer(qid).then(answers => {
            this.questionList[qindex][2] = answers;
        });
    }

    expand(question):void {
        // expand if hidden
        if(question[1]==true){
            let qindex:number;
            // hide all other questions that are expanded
            for (let i =0; i< this.questionList.length; ++i){
                if (this.questionList[i][1] == false){
                    this.questionList[i][1] =true;
                } if(this.questionList[i][0].id == question[0].id){
                    qindex=i;
                } //get where the question located in list
            }
            this.answer = ""; //clear answer tab
            question[1] = false;
            this.chooseAnswerEnable = (question[0].author === this.user.username) && (question[0].select_id === -1);

            //get answers if it is not loaded
            if(question[2].length == 0){ 
                question[2] = this.getAnswer(question[0].id, qindex);
            }
        }
        // collapse if opened
        else{
            question[1] = true;
        }
    }

    // helper function to retrieve quesiton index from question id
    findQuestion(id): number {
        for (let i  = 0; i < this.questionList.length; ++i){
            if(this.questionList[i][0].id === id){
                return i;
            }
        }
    }

    answerClick(id):void{
        if(this.answer=="")
            alert("Please type answer!");
        else{
            this.answerService.postAnswer(this.answer, id).then(Status=>{
                if(Status != 204) {
                    alert("Question could not be sent, please try again");
                }
                else {
                    // send notification to the receiver
                    // only if the answer has not been chosen and the receiver is not the user him/herself
                    var qindex = this.findQuestion(id);
                    if ((this.questionList[qindex][0].select_id === -1) && (this.questionList[qindex][0].author != this.user.username)){
                
                        var msg = {
                            type: "message",
                            q_author: this.questionList[qindex][0].author,
                            text: this.answer,
                        }
                        this.socket.send(JSON.stringify(msg));
                    }

                    alert("Answer successfully posted!");

                    this.answer = "";
                    this.getQuestionList(this.tabNum);
                }
            });
        }
    }

    
    chooseAnswer(qid, aid, i): void{
        this.questionService.selectAnswer(qid, aid).then(Status=>{
            if(Status != 204){
                alert("Choice could not be sent, please try again");
            } else {
                alert("Answer successfully selected!");
                this.questionList[i][0].select_id = aid;
                this.chooseAnswerEnable = false;
            }
        });
    }
}/* istanbul ignore next */
