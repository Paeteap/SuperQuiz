import { inject, Injectable } from '@angular/core';
import { Quiz } from './Quiz';
import { Question } from './Question';
import { v4 as uuidv4 } from 'uuid';
import {Preferences} from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private http: HttpClient = inject(HttpClient);
  public currentQuiz: Quiz = {id: '', quizName: 'newQuiz', questions: []};

  constructor() { 
    /*this.currentQuiz.questions.push({
      id: '1',
      title: 'What is the capital of France?',
      a1: 'Paris',
      a2: 'London',
      a3: 'Berlin',
      a4: 'Madrid',
      correct: 1
    })*/
    //this.loadQuiz();
    this.loadQuizFromJSON();
    console.log("Hallo3");
  }

  loadQuizFromJSON() {
    this.http.get('https://www.schmiedl.co.at/json_cors/data.json').subscribe((data) => {
      if (data && data.hasOwnProperty('quizName'))
        this.currentQuiz = data as Quiz;
      else
        console.log("oje: ", data);
    });
  }

  /*public loadQuiz() {
    let returnPromise = Preferences.get({key: 'GrischaSuperQuiz202503'});
    returnPromise.then((q)=>{
      console.log("Hallo1");
      if (q.value)
        this.currentQuiz = JSON.parse(q.value) as Quiz;
    }).catch((e)=>{
      console.log(e);
    });
    console.log("Hallo2");
  }*/

  public async loadQuiz() {
    try {
      let q = await Preferences.get({key: 'GrischaSuperQuiz202503'});
      console.log("Hallo1");
      if (q.value)
        this.currentQuiz = JSON.parse(q.value) as Quiz;
        console.log(q.value);
    } catch (e) {
      console.log(e);
    }
    console.log("Hallo2");
  }


  public saveQuiz() {
    Preferences.set({
      key: 'GrischaSuperQuiz202503',
      value: JSON.stringify(this.currentQuiz)
    });
  }

  public getNewQuestion(): Question {
    return {
      id: '0',
      title: '',
      a1: '',
      a2: '',
      a3: '',
      a4: '',
      correct: 1
    }
  }

  public getQuestion(qid: string): Question | undefined {
    return this.currentQuiz.questions.find(q => q.id === qid);
  }

  public addQuestion(q: Question) {   
    if (q.id === '0') {
      q.id = uuidv4();
    }
    this.currentQuiz.questions.push(q);
    this.saveQuiz();
  }

  public deleteQuestion(q: Question) {
    this.currentQuiz.questions = this.currentQuiz.questions.filter(qq => qq.id !== q.id);
    this.saveQuiz();
  }

}
