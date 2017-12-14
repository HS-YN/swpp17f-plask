import { Injectable } from '@angular/core';
import { Headers, Http, XSRFStrategy  } from '@angular/http';
import { Question  } from '../question/question';
import { Answer } from '../answer/answer';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';
import 'rxjs/add/operator/toPromise';

type QList = [Question, boolean, Answer[]][];

 @Injectable()
 export class TabService{
     constructor(
         private questionService: QuestionService,
         private answerService: AnswerService,
     ){}


 }
