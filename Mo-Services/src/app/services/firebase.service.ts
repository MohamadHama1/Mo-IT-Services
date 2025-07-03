import { Injectable } from '@angular/core';
import { ref, get, onValue, DataSnapshot } from 'firebase/database';
import { database } from '../firebase.configt';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TranslationData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private currentLanguage = new BehaviorSubject<string>('en');
  private translations = new BehaviorSubject<TranslationData>({});
  
  currentLanguage$ = this.currentLanguage.asObservable();
  translations$ = this.translations.asObservable();

  constructor() {
    // Set default language from localStorage or browser language
    const savedLanguage = localStorage.getItem('selectedLanguage') || 
                         this.getBrowserLanguage();
    this.setLanguage(savedLanguage);
  }

  private getBrowserLanguage(): string {
    const browserLang = navigator.language.toLowerCase();
    const supportedLanguages = ['en', 'sv', 'de', 'ar'];
    
    // Check if browser language matches supported languages
    for (const lang of supportedLanguages) {
      if (browserLang.startsWith(lang)) {
        return lang;
      }
    }
    
    return 'en'; // Default fallback
  }

  setLanguage(language: string): void {
    const supportedLanguages = ['en', 'sv', 'de', 'ar'];
    
    if (supportedLanguages.includes(language)) {
      this.currentLanguage.next(language);
      localStorage.setItem('selectedLanguage', language);
      this.loadTranslations(language);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  private loadTranslations(language: string): void {
    const translationsRef = ref(database, `translations/${language}`);
    
    // Listen for real-time updates
    onValue(translationsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        this.translations.next(data);
      } else {
        console.warn(`No translations found for language: ${language}`);
        // Fallback to English if current language fails
        if (language !== 'en') {
          this.loadTranslations('en');
        }
      }
    }, (error) => {
      console.error('Error loading translations:', error);
      // Fallback to English on error
      if (language !== 'en') {
        this.loadTranslations('en');
      }
    });
  }

  // Get translation by key with dot notation support (e.g., 'navbar.about')
  getTranslation(key: string): Observable<string> {
    return new Observable(observer => {
      this.translations$.subscribe(translations => {
        const value = this.getNestedValue(translations, key);
        observer.next(value || key); // Return key if translation not found
      });
    });
  }

  // Synchronous method to get translation
  getTranslationSync(key: string): string {
    const translations = this.translations.value;
    return this.getNestedValue(translations, key) || key;
  }

  private getNestedValue(obj: any, key: string): string {
    return key.split('.').reduce((current, prop) => {
      return current && current[prop] ? current[prop] : null;
    }, obj);
  }

  // Method to get all translations for a specific section
  getSectionTranslations(section: string): Observable<any> {
    return new Observable(observer => {
      this.translations$.subscribe(translations => {
        observer.next(translations[section] || {});
      });
    });
  }

  // Initialize database with default translations (for development)
  async initializeDefaultTranslations(): Promise<void> {
    try {
      const translationsRef = ref(database, 'translations');
      const snapshot = await get(translationsRef);
      
      if (!snapshot.exists()) {
        // Default translations structure
        const defaultTranslations = {
          en: {
            navbar: {
              brand: "TechSolutions",
              about: "About Us",
              services: "Services",
              portfolio: "Portfolio",
              contact: "Contact"
            },
            about: {
              title: "About TechSolutions",
              description: "We are a passionate team of technology experts dedicated to transforming businesses through innovative digital solutions. With years of experience in web development, app creation, and digital marketing, we help companies establish a strong online presence and achieve their technological goals.",
              mission: "Our mission is to bridge the gap between technology and business success, delivering cutting-edge solutions that drive growth and innovation."
            },
            services: {
              title: "Our Service Packages",
              subtitle: "Choose the perfect package for your business needs",
              packages: {
                budget: {
                  name: "Budget Package",
                  price: "7,000",
                  support: "1 Month Free Tech Support",
                  features: [
                    "Website & App Development",
                    "Domain Registration & Management",
                    "Search Engine Optimization (SEO)",
                    "Training & Consultation",
                    "1 Month Free Tech Support & Maintenance"
                  ]
                },
                professional: {
                  name: "Professional Package",
                  price: "11,000",
                  support: "2 Months Free Tech Support",
                  features: [
                    "Everything in Budget Package",
                    "Web Hosting & Deployment",
                    "Business Email Setup",
                    "Personal Dashboard",
                    "2 Months Free Tech Support & Maintenance"
                  ]
                },
                premium: {
                  name: "Premium Package",
                  price: "15,000",
                  support: "3 Months Free Tech Support",
                  features: [
                    "Everything from Professional Package",
                    "Social Media Integration",
                    "Social Media Management",
                    "Easy Online Ordering",
                    "Flexible Payment Options",
                    "Chat Bot Implementation",
                    "3 Months Free Tech Support & Maintenance"
                  ]
                },
                custom: {
                  name: "Custom Package",
                  price: "?",
                  support: "Premium Support",
                  features: [
                    "Tailored to your specific needs",
                    "Flexible pricing options",
                    "Scalable solutions",
                    "Advanced integrations",
                    "Dedicated project manager"
                  ]
                }
              }
            },
            portfolio: {
              title: "Our Featured Work",
              subtitle: "Showcasing our most impactful projects"
            },
            contact: {
              title: "Get In Touch",
              subtitle: "Ready to start your next project? Let's discuss how we can help you achieve your goals.",
              form: {
                name: "Full Name",
                email: "Email Address",
                company: "Company (Optional)",
                service: "Service Interested In",
                message: "Project Description",
                messagePlaceholder: "Tell us about your project requirements, timeline, and any specific features you need...",
                submit: "Send Message"
              }
            },
            footer: {
              brand: "TechSolutions",
              tagline: "Transforming businesses through technology.",
              quickLinks: "Quick Links",
              contact: "Contact",
              email: "info@techsolutions.com",
              phone: "+1 (555) 123-4567",
              copyright: "© 2025 TechSolutions. All rights reserved."
            }
          },
          sv: {
            navbar: {
              brand: "TechSolutions",
              about: "Om Oss",
              services: "Tjänster",
              portfolio: "Portfolio",
              contact: "Kontakt"
            },
            about: {
              title: "Om TechSolutions",
              description: "Vi är ett passionerat team av teknikexperter som är dedikerade till att transformera företag genom innovativa digitala lösningar. Med års erfarenhet av webbutveckling, appskapande och digital marknadsföring hjälper vi företag att etablera en stark online-närvaro och uppnå sina teknologiska mål.",
              mission: "Vårt uppdrag är att överbrygga klyftan mellan teknik och affärsframgång, leverera toppmoderna lösningar som driver tillväxt och innovation."
            },
            services: {
              title: "Våra Servicepaket",
              subtitle: "Välj det perfekta paketet för dina affärsbehov"
            },
            portfolio: {
              title: "Vårt Utvalda Arbete",
              subtitle: "Visar våra mest påverkningsfulla projekt"
            },
            contact: {
              title: "Kontakta Oss",
              subtitle: "Redo att starta ditt nästa projekt? Låt oss diskutera hur vi kan hjälpa dig uppnå dina mål."
            },
            footer: {
              brand: "TechSolutions",
              tagline: "Transformerar företag genom teknik.",
              quickLinks: "Snabblänkar",
              contact: "Kontakt",
              email: "info@techsolutions.com",
              phone: "+1 (555) 123-4567",
              copyright: "© 2025 TechSolutions. Alla rättigheter förbehållna."
            }
          },
          de: {
            navbar: {
              brand: "TechSolutions",
              about: "Über Uns",
              services: "Dienstleistungen",
              portfolio: "Portfolio",
              contact: "Kontakt"
            },
            about: {
              title: "Über TechSolutions",
              description: "Wir sind ein leidenschaftliches Team von Technologie-Experten, die sich der Transformation von Unternehmen durch innovative digitale Lösungen widmen. Mit jahrelanger Erfahrung in der Webentwicklung, App-Erstellung und digitalem Marketing helfen wir Unternehmen dabei, eine starke Online-Präsenz aufzubauen und ihre technologischen Ziele zu erreichen.",
              mission: "Unsere Mission ist es, die Lücke zwischen Technologie und Geschäftserfolg zu schließen und modernste Lösungen zu liefern, die Wachstum und Innovation vorantreiben."
            },
            services: {
              title: "Unsere Service-Pakete",
              subtitle: "Wählen Sie das perfekte Paket für Ihre Geschäftsanforderungen"
            },
            portfolio: {
              title: "Unsere Ausgewählten Arbeiten",
              subtitle: "Präsentation unserer wirkungsvollsten Projekte"
            },
            contact: {
              title: "Kontakt Aufnehmen",
              subtitle: "Bereit, Ihr nächstes Projekt zu starten? Lassen Sie uns besprechen, wie wir Ihnen helfen können, Ihre Ziele zu erreichen."
            },
            footer: {
              brand: "TechSolutions",
              tagline: "Unternehmen durch Technologie transformieren.",
              quickLinks: "Schnelle Links",
              contact: "Kontakt",
              email: "info@techsolutions.com",
              phone: "+1 (555) 123-4567",
              copyright: "© 2025 TechSolutions. Alle Rechte vorbehalten."
            }
          },
          ar: {
            navbar: {
              brand: "TechSolutions",
              about: "من نحن",
              services: "الخدمات",
              portfolio: "الأعمال",
              contact: "اتصل بنا"
            },
            about: {
              title: "حول TechSolutions",
              description: "نحن فريق متحمس من خبراء التكنولوجيا المتخصصين في تحويل الشركات من خلال الحلول الرقمية المبتكرة. مع سنوات من الخبرة في تطوير الويب وإنشاء التطبيقات والتسويق الرقمي، نساعد الشركات على إنشاء حضور قوي عبر الإنترنت وتحقيق أهدافها التقنية.",
              mission: "مهمتنا هي سد الفجوة بين التكنولوجيا ونجاح الأعمال، وتقديم حلول متطورة تدفع النمو والابتكار."
            },
            services: {
              title: "حزم خدماتنا",
              subtitle: "اختر الحزمة المثالية لاحتياجات عملك"
            },
            portfolio: {
              title: "أعمالنا المميزة",
              subtitle: "عرض مشاريعنا الأكثر تأثيراً"
            },
            contact: {
              title: "تواصل معنا",
              subtitle: "هل أنت مستعد لبدء مشروعك القادم؟ دعنا نناقش كيف يمكننا مساعدتك في تحقيق أهدافك."
            },
            footer: {
              brand: "TechSolutions",
              tagline: "تحويل الشركات من خلال التكنولوجيا.",
              quickLinks: "روابط سريعة",
              contact: "اتصل بنا",
              email: "info@techsolutions.com",
              phone: "+1 (555) 123-4567",
              copyright: "© 2025 TechSolutions. جميع الحقوق محفوظة."
            }
          }
        };
        
        console.log('Initializing default translations...');
        // Note: In a real app, you would use Firebase's set() method here
        // import { ref, set } from 'firebase/database';
        // await set(translationsRef, defaultTranslations);
      }
    } catch (error) {
      console.error('Error initializing translations:', error);
    }
  }
}