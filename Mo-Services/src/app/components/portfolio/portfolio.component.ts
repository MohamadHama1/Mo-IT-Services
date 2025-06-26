import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
 portfolioItems = [
    {
      title: 'E-Commerce Revolution',
      category: 'Web Development',
      year: '2024',
      description: 'A comprehensive e-commerce platform with advanced analytics, inventory management, and seamless payment integration. Built for scalability and performance.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      link: 'https://example-ecommerce.com',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS']
    },
    {
      title: 'HealthCare Dashboard',
      category: 'Healthcare Tech',
      year: '2024',
      description: 'Advanced patient management system featuring real-time monitoring, appointment scheduling, and comprehensive medical records management.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      link: 'https://example-healthcare.com',
      technologies: ['Angular', 'Express', 'PostgreSQL', 'Chart.js', 'Socket.io']
    },
    {
      title: 'AI-Powered Analytics',
      category: 'Artificial Intelligence',
      year: '2024',
      description: 'Machine learning-driven analytics platform that provides predictive insights and automated reporting for business intelligence.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      link: 'https://example-ai.com',
      technologies: ['Python', 'TensorFlow', 'Django', 'D3.js', 'Docker']
    }
  ];
}
