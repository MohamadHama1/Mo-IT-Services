import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy {
  footerTexts: any = {};
  private subscription: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.subscription.add(
      this.firebaseService.getSectionTranslations('footer').subscribe(texts => {
        this.footerTexts = texts;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}