import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class ContactoPage implements OnInit {
  contactForm: FormGroup;
  isSubmitting: boolean = false;
  isOnline: boolean = navigator.onLine;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private menuController = inject(MenuController);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private databaseService = inject(DatabaseService);

  constructor() {
    this.contactForm = this.createForm();
  }

  ngOnInit() {
    // Escuchar cambios en el estado de conexión
    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[+]?[0-9\\s\\-()]+$')]],
      tema: ['', Validators.required],
      urgencia: ['media'],
      mensaje: ['', [Validators.required, Validators.minLength(20)]],
      aceptaPrivacidad: [false, Validators.requiredTrue]
    });
  }

  async enviarContacto() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const loading = await this.loadingController.create({
        message: 'Enviando consulta...',
        duration: 3000
      });
      await loading.present();

      try {
        const formData = this.contactForm.value;
        
        // Simular envío de datos
        await this.saveConsultation(formData);
        
        await loading.dismiss();
        
        await this.showSuccessMessage();
        this.contactForm.reset();
        this.contactForm.patchValue({
          urgencia: 'media',
          aceptaPrivacidad: false
        });
        
      } catch (error) {
        await loading.dismiss();
        console.error('Error al enviar consulta:', error);
        await this.showErrorMessage();
      } finally {
        this.isSubmitting = false;
      }
    } else {
      await this.showValidationErrors();
    }
  }

  private async saveConsultation(data: any) {
    // Guardar consulta localmente
    const consultation = {
      id: Date.now(),
      ...data,
      fechaEnvio: new Date().toISOString(),
      estado: this.isOnline ? 'enviado' : 'pendiente'
    };

    try {
      const consultations = await this.databaseService.getCachedData('consultations') || '[]';
      const consultationsArray = JSON.parse(consultations);
      consultationsArray.push(consultation);
      await this.databaseService.cacheData('consultations', JSON.stringify(consultationsArray));
    } catch (error) {
      console.error('Error saving consultation:', error);
    }

    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: '¡Consulta Enviada!',
      message: this.isOnline 
        ? 'Tu consulta ha sido enviada exitosamente. Nos pondremos en contacto contigo dentro de 24-48 horas hábiles.'
        : 'Tu consulta ha sido guardada y se enviará automáticamente cuando tengas conexión a internet.',
      buttons: ['Entendido']
    });
    await alert.present();
  }

  private async showErrorMessage() {
    const toast = await this.toastController.create({
      message: 'Error al enviar la consulta. Por favor, intenta nuevamente.',
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  private async showValidationErrors() {
    const errors: string[] = [];
    
    if (this.contactForm.get('nombre')?.invalid) {
      errors.push('El nombre es obligatorio');
    }
    if (this.contactForm.get('correo')?.invalid) {
      errors.push('Ingresa un correo válido');
    }
    if (this.contactForm.get('tema')?.invalid) {
      errors.push('Selecciona un tema de consulta');
    }
    if (this.contactForm.get('mensaje')?.invalid) {
      errors.push('El mensaje debe tener al menos 20 caracteres');
    }
    if (this.contactForm.get('aceptaPrivacidad')?.invalid) {
      errors.push('Debes aceptar la política de privacidad');
    }

    const alert = await this.alertController.create({
      header: 'Formulario Incompleto',
      message: 'Por favor, corrige los siguientes errores:\n\n• ' + errors.join('\n• '),
      buttons: ['Entendido']
    });
    await alert.present();
  }

  async showPrivacyPolicy() {
    const alert = await this.alertController.create({
      header: 'Política de Privacidad',
      message: `
        <p><strong>Tratamiento de Datos Personales</strong></p>
        <p>Los datos proporcionados serán utilizados exclusivamente para:</p>
        <ul>
          <li>Brindar asesoría legal personalizada</li>
          <li>Contactarte sobre tu consulta</li>
          <li>Mejorar nuestros servicios</li>
        </ul>
        
        <p><strong>Confidencialidad</strong></p>
        <p>Toda la información está protegida por el secreto profesional y no será compartida con terceros sin tu autorización.</p>
        
        <p><strong>Tus Derechos</strong></p>
        <p>Tienes derecho a acceder, rectificar o eliminar tus datos contactando a consultas@derechofamiliacl.cl</p>
      `,
      buttons: ['Entendido']
    });
    await alert.present();
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark.toString());
  }

  // Validadores personalizados
  get formErrors() {
    return {
      nombre: this.contactForm.get('nombre')?.invalid && this.contactForm.get('nombre')?.touched,
      correo: this.contactForm.get('correo')?.invalid && this.contactForm.get('correo')?.touched,
      tema: this.contactForm.get('tema')?.invalid && this.contactForm.get('tema')?.touched,
      mensaje: this.contactForm.get('mensaje')?.invalid && this.contactForm.get('mensaje')?.touched,
      privacidad: this.contactForm.get('aceptaPrivacidad')?.invalid && this.contactForm.get('aceptaPrivacidad')?.touched
    };
  }
}
