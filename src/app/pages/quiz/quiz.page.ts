import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonItem } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class QuizPage implements OnInit {
  public data = inject(DataService);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private router = inject(Router);

  public shuffledQuestions: any[] = [];
  public pointer: number = 0;
  public currentElement: any;
  public score: number = 0;

  constructor() {}

  ngOnInit() {
    const originalQuestions = [...this.data.currentQuiz.questions];
    this.shuffledQuestions = this.shuffle(originalQuestions);

    this.pointer = 0;
    this.currentElement = this.shuffledQuestions[this.pointer];
  }

  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async nextQuestion() {
    this.pointer++;
    if (this.pointer < this.shuffledQuestions.length) {
      this.currentElement = this.shuffledQuestions[this.pointer];
    } else {
      const alert = await this.alertController.create({
        header: 'Quiz Finished!',
        message: `You scored ${this.score} out of ${this.shuffledQuestions.length}.`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('/home');
          }
        }]
      });
  
      await alert.present();
    }
  }  

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      color,
    });
  
    await toast.present();
  }

  checkAnswer(selectedKey: string) {
    const selectedAnswer = this.currentElement[selectedKey];
    const correctKey = 'a' + this.currentElement.correct;
    const isCorrect = selectedKey === correctKey;
  
    if (isCorrect) {
      this.score++;
    }
  
    this.showToast(isCorrect ? 'Correct! 🎉' : 'Wrong! ❌', isCorrect ? 'success' : 'danger');
    setTimeout(() => this.nextQuestion(), 1000);
  }
}

