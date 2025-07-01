import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonButtons,
  IonBackButton,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonButtons,
    IonBackButton
  ]
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Enviando email de recuperación...',
        duration: 5000
      });
      await loading.present();

      try {
        const email = this.forgotPasswordForm.value.email;
        const success = await this.authService.resetPassword(email);
        
        await loading.dismiss();
        this.isLoading = false;

        if (success) {
          this.emailSent = true;
          const toast = await this.toastController.create({
            message: 'Se ha enviado un email de recuperación a tu correo.',
            duration: 5000,
            color: 'success',
            position: 'top'
          });
          await toast.present();
        } else {
          await this.showErrorAlert('Email no encontrado', 'No existe una cuenta asociada a este email.');
        }
      } catch (error) {
        await loading.dismiss();
        this.isLoading = false;
        await this.showErrorAlert('Error', 'Ocurrió un error al procesar tu solicitud.');
      }
    } else {
      await this.showValidationErrors();
    }
  }

  async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showValidationErrors() {
    const alert = await this.alertController.create({
      header: 'Error de validación',
      message: 'Por favor ingresa un email válido.',
      buttons: ['OK']
    });
    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async resendEmail() {
    if (this.forgotPasswordForm.valid) {
      await this.onSubmit();
    }
  }
}
