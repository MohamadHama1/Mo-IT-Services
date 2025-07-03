import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    
    // Firebase App initialization
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    
    // Realtime Database (for your existing functionality)
    provideDatabase(() => getDatabase()),
    
    // Firestore (needed for email extension)
    provideFirestore(() => getFirestore())
  ]
};