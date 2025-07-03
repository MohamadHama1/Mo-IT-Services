import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolioTexts: any = {};
  portfolioItems: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.subscription.add(
      this.firebaseService.getSectionTranslations('portfolio').subscribe(texts => {
        this.portfolioTexts = texts;
        // Get the projects from the translation data
        this.portfolioItems = texts.projects || [];
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}