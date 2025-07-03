import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Mo-Services';

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Initialize Firebase service and load translations
    // Uncomment the line below if you want to initialize default translations
    // this.firebaseService.initializeDefaultTranslations();
  }
}