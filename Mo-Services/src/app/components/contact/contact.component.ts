import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  };

  onSubmit() {
    if (this.isFormValid()) {
      // Create mailto link
      const subject = `New Project Inquiry - ${this.formData.service}`;
      const body = `
Name: ${this.formData.name}
Email: ${this.formData.email}
Company: ${this.formData.company}
Service: ${this.formData.service}

Message:
${this.formData.message}
      `;
      
      const mailtoLink = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      
      // Reset form
      this.formData = {
        name: '',
        email: '',
        company: '',
        service: '',
        message: ''
      };
      
      alert('Thank you for your message! Your email client should open now.');
    }
  }

  private isFormValid(): boolean {
    return !!(this.formData.name && 
              this.formData.email && 
              this.formData.service && 
              this.formData.message);
  }
}
