import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, OnDestroy {
  contactTexts: any = {};
  private subscription: Subscription = new Subscription();
  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;

  formData = {
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.firebaseService.getSectionTranslations('contact').subscribe(texts => {
        this.contactTexts = texts;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onSubmit() {
    if (this.isFormValid() && !this.isSubmitting) {
      this.isSubmitting = true;
      this.showSuccessMessage = false;
      this.showErrorMessage = false;

      try {
        // Create email document for Trigger Email Extension
        const emailDoc = {
          to: ['contact@mo-it-services.com'], // Replace with your actual email
          message: {
            subject: `New Project Inquiry - ${this.getServiceDisplayName(this.formData.service)}`,
            html: this.generateEmailTemplate(),
            text: this.generatePlainTextEmail() // Fallback for plain text
          },
          // Optional: Add custom data for tracking
          metadata: {
            formType: 'contact',
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        };

        // Add document to 'mail' collection - this triggers the email
        const mailCollection = collection(this.firestore, 'mail');
        await addDoc(mailCollection, emailDoc);

        // Also save form submission for your records (optional)
        const submissionsCollection = collection(this.firestore, 'contact-submissions');
        await addDoc(submissionsCollection, {
          ...this.formData,
          submittedAt: new Date().toISOString(),
          status: 'email-sent'
        });

        this.showSuccessMessage = true;
        this.resetForm();
        
        // Hide success message after 8 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 8000);

      } catch (error) {
        console.error('Error sending email:', error);
        this.showErrorMessage = true;
        
        // Hide error message after 8 seconds
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 8000);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  private generateEmailTemplate(): string {
    const submissionTime = new Date().toLocaleString('sv-SE', { 
      timeZone: 'Europe/Stockholm',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">MO IT Services Website</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 20px;">📞 Contact Information</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; font-weight: bold; width: 30%; color: #6c757d;">👤 Name:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #212529;">${this.formData.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; font-weight: bold; color: #6c757d;">📧 Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <a href="mailto:${this.formData.email}" style="color: #007bff; text-decoration: none;">${this.formData.email}</a>
                </td>
              </tr>
              ${this.formData.company ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; font-weight: bold; color: #6c757d;">🏢 Company:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #212529;">${this.formData.company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #6c757d;">💼 Service:</td>
                <td style="padding: 12px 0; color: #212529;">
                  <span style="background: #e3f2fd; color: #1565c0; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                    ${this.getServiceDisplayName(this.formData.service)}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 20px;">💬 Project Description</h2>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px;">
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.7;">${this.formData.message}</p>
            </div>
          </div>
          
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #0c5460;">
              <strong>⏰ Submitted:</strong> ${submissionTime} (Swedish time)
            </p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              <strong>Quick Actions:</strong> 
              <a href="mailto:${this.formData.email}?subject=Re: Your inquiry about ${this.getServiceDisplayName(this.formData.service)}" 
                 style="color: #007bff; text-decoration: none; margin: 0 10px;">Reply to Client</a> |
              <a href="tel:${this.formData.email}" style="color: #007bff; text-decoration: none; margin: 0 10px;">Add to Calendar</a>
            </p>
          </div>
          
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px;">
          <p>This email was automatically generated from your MO IT Services contact form.</p>
        </div>
        
      </body>
      </html>
    `;
  }

  private generatePlainTextEmail(): string {
    return `
NEW CONTACT FORM SUBMISSION - MO IT Services

Contact Information:
- Name: ${this.formData.name}
- Email: ${this.formData.email}
- Company: ${this.formData.company || 'Not provided'}
- Service: ${this.getServiceDisplayName(this.formData.service)}

Project Description:
${this.formData.message}

Submitted: ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })} (Swedish time)

Reply directly to this email to contact the client.
    `;
  }

  private getServiceDisplayName(service: string): string {
    const serviceMap: { [key: string]: string } = {
      'budget-package': 'Budget Package (7,000 kr)',
      'professional-package': 'Professional Package (11,000 kr)',
      'premium-package': 'Premium Package (15,000 kr)',
      'custom-solution': 'Custom Solution',
      'consultation': 'Consultation Only'
    };
    return serviceMap[service] || service;
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      company: '',
      service: '',
      message: ''
    };
  }

  private isFormValid(): boolean {
    return !!(this.formData.name && 
              this.formData.email && 
              this.formData.service && 
              this.formData.message);
  }
}