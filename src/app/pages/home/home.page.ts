import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {

  public data = inject(DataService);
  private router = inject(Router);

  constructor() {
    
  }
  showList() {
    this.router.navigate(['/question-list']);
  }
  startQuiz() {
    this.router.navigate(['/quiz']);
  }
}
