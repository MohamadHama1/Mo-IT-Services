import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  packages = [
    {
      name: 'Budget Package',
      price: '7,000',
      support: '1 Month Free Tech Support',
      features: [
        'Website & App Development',
        'Domain Registration & Management',
        'Search Engine Optimization (SEO)',
        'Training & Consultation',
        '1 Month Free Tech Support & Maintenance'
      ]
    },
    {
      name: 'Professional Package',
      price: '11,000',
      support: '2 Months Free Tech Support',
      features: [
        'Everything in Budget Package',
        'Web Hosting & Deployment',
        'Business Email Setup',
        'Personal Dashboard',
        '2 Months Free Tech Support & Maintenance'
      ]
    },
    {
      name: 'Premium Package',
      price: '15,000',
      support: '3 Months Free Tech Support',
      features: [
        'Everything from Professional Package',
        'Social Media Integration',
        'Social Media Management',
        'Easy Online Ordering',
        'Flexible Payment Options',
        'Chat Bot Implementation',
        '3 Months Free Tech Support & Maintenance'
      ]
    }
  ];
}
