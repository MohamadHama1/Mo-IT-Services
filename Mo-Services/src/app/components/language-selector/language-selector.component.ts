
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnInit {
  currentLanguage = 'en';
  isOpen = false;

  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      this.updateDocumentDirection(lang);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        this.isOpen = false;
      }
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(languageCode: string) {
    this.firebaseService.setLanguage(languageCode);
    this.isOpen = false;
  }

  getFlagEmoji(langCode: string): string {
    const lang = this.languages.find(l => l.code === langCode);
    return lang ? lang.flag : '🌐';
  }

  private updateDocumentDirection(lang: string) {
    // Set document direction for RTL languages
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', lang);
  }
}