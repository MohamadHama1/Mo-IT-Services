import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, OnDestroy {
  aboutTexts: any = {};
  backgroundImages: string[] = [
    'assets/about/1.jpg',
  ];
  currentImageIndex = 0;
  intervalId: any;
  private subscription: Subscription = new Subscription();
  private preloadedImages: HTMLImageElement[] = [];
  private isTransitioning = false;

  constructor(
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    // Load about text content
    this.subscription.add(
      this.firebaseService.getSectionTranslations('about').subscribe(texts => {
        this.aboutTexts = texts;
      })
    );

    // Preload all images to prevent flickering
    this.preloadImages();
    this.initializeSlideshow();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private preloadImages() {
    this.preloadedImages = [];
    this.backgroundImages.forEach(imageUrl => {
      const img = new Image();
      img.src = imageUrl;
      this.preloadedImages.push(img);
    });
  }

  private initializeSlideshow() {
    if (this.backgroundImages.length === 0) return;
    
    // Set initial image immediately
    this.updateBackgroundImage();
    
    // Start slideshow with consistent timing
    this.intervalId = setInterval(() => {
      this.nextBackgroundImage();
    }, 6000); // 6 seconds between each image change
  }

  nextBackgroundImage() {
    if (this.isTransitioning || this.backgroundImages.length === 0) return;
    
    this.isTransitioning = true;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
    
    this.performCrossfadeTransition();
  }

  private performCrossfadeTransition() {
    const aboutBg = document.querySelector('.about-bg') as HTMLElement;
    const aboutSection = document.querySelector('.about-section') as HTMLElement;
    
    if (!aboutBg || !aboutSection) {
      this.isTransitioning = false;
      return;
    }

    // Create a temporary background element for smooth crossfade
    const tempBg = document.createElement('div');
    tempBg.className = 'about-bg-temp';
    tempBg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${this.backgroundImages[this.currentImageIndex]}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: brightness(0.7);
      z-index: -3;
      opacity: 0;
      transition: opacity 1.5s ease-in-out;
    `;

    // Insert the temporary background
    aboutSection.appendChild(tempBg);

    // Trigger the fade-in after a brief delay to ensure CSS is applied
    setTimeout(() => {
      tempBg.style.opacity = '1';
    }, 50);

    // After transition completes, update the main background and remove temp
    setTimeout(() => {
      aboutBg.style.backgroundImage = `url('${this.backgroundImages[this.currentImageIndex]}')`;
      aboutSection.removeChild(tempBg);
      this.isTransitioning = false;
    }, 1600); // Slightly longer than transition duration
  }

  updateBackgroundImage() {
    const aboutBg = document.querySelector('.about-bg') as HTMLElement;
    if (aboutBg && this.backgroundImages.length > 0) {
      const currentImage = this.backgroundImages[this.currentImageIndex];
      aboutBg.style.backgroundImage = `url('${currentImage}')`;
      aboutBg.style.backgroundSize = 'cover';
      aboutBg.style.backgroundPosition = 'center';
      aboutBg.style.backgroundRepeat = 'no-repeat';
    }
  }

  // You can add additional methods here if needed
  learnMore() {
    // Navigation logic or scroll to more content
    console.log('Learn more clicked');
  }
}