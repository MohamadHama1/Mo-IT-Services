import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  navbarTexts: any = {};
  private subscription: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.subscription.add(
      this.firebaseService.getSectionTranslations('navbar').subscribe(texts => {
        this.navbarTexts = texts;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}