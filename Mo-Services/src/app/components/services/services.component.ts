import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit, OnDestroy {
  servicesTexts: any = {};
  packages: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.subscription.add(
      this.firebaseService.getSectionTranslations('services').subscribe(texts => {
        this.servicesTexts = texts;
        this.updatePackages();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updatePackages() {
    if (this.servicesTexts.packages) {
      this.packages = [
        this.servicesTexts.packages.budget,
        this.servicesTexts.packages.professional,
        this.servicesTexts.packages.premium
      ].filter(pkg => pkg); // Filter out undefined packages
    }
  }
}