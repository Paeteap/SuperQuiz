import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [
    IonLabel, IonItem, IonBackButton, IonButtons,
    IonButton, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule
  ]
})
export class QuizPage implements OnInit {
  public data = inject(DataService);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private router = inject(Router);

  public shuffledQuestions: any[] = [];
  public pointer = 0;
  public currentElement: any;
  public score = 0;

  ngOnInit() {
    const originalQuestions = [...this.data.currentQuiz.questions];
    this.shuffledQuestions = this.shuffle(originalQuestions);
    this.pointer = 0;
    this.currentElement = this.shuffledQuestions[this.pointer];
  }

  private shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  private getCorrectKey(): string {
    return 'a' + this.currentElement.correct;
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      color,
    });
    await toast.present();
  }

  async checkAnswer(selectedKey: string) {
    const isCorrect = selectedKey === this.getCorrectKey();

    if (isCorrect) this.score++;

    await this.showToast(isCorrect ? 'Correct!' : 'Wrong!', isCorrect ? 'success' : 'danger');

    setTimeout(() => this.nextQuestion(), 1000);
  }

  async nextQuestion() {
    this.pointer++;

    if (this.pointer < this.shuffledQuestions.length) {
      this.currentElement = this.shuffledQuestions[this.pointer];
      return;
    }

    const alert = await this.alertController.create({
      header: 'Quiz Finished!',
      message: `You scored ${this.score} out of ${this.shuffledQuestions.length}.`,
      buttons: [{
        text: 'OK',
        handler: () => this.router.navigateByUrl('/home')
      }]
    });

    await alert.present();
  }
}
