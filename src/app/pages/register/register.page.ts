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
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonCheckbox,
  IonProgressBar,
  IonButtons,
  IonBackButton,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonCheckbox,
    IonProgressBar,
    IonButtons,
    IonBackButton
  ]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  passwordStrength = { isValid: false, errors: [] as string[] };
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  acceptTerms = false;

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
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Observar cambios en la contraseña para validar fortaleza
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      if (password) {
        this.passwordStrength = this.authService.validatePasswordStrength(password);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid && this.acceptTerms && this.passwordStrength.isValid) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Registrando usuario...',
        duration: 5000
      });
      await loading.present();

      try {
        const formValue = this.registerForm.value;
        const userData = {
          username: formValue.username,
          email: formValue.email,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          role: formValue.role as 'user' | 'admin'
        };

        const success = await this.authService.register(userData, formValue.password);
        
        await loading.dismiss();
        this.isLoading = false;

        if (success) {
          const toast = await this.toastController.create({
            message: 'Registro exitoso. Ya puedes iniciar sesión.',
            duration: 3000,
            color: 'success',
            position: 'top'
          });
          await toast.present();
          
          this.router.navigate(['/login']);
        } else {
          await this.showErrorAlert('Error al registrar usuario', 'El usuario o email ya existe.');
        }
      } catch (error) {
        await loading.dismiss();
        this.isLoading = false;
        await this.showErrorAlert('Error', 'Ocurrió un error durante el registro.');
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
    let message = 'Por favor corrige los siguientes errores:\n\n';
    
    if (this.registerForm.get('firstName')?.invalid) {
      message += '• Nombre es requerido (mínimo 2 caracteres)\n';
    }
    if (this.registerForm.get('lastName')?.invalid) {
      message += '• Apellido es requerido (mínimo 2 caracteres)\n';
    }
    if (this.registerForm.get('username')?.invalid) {
      message += '• Usuario es requerido (mínimo 3 caracteres)\n';
    }
    if (this.registerForm.get('email')?.invalid) {
      message += '• Email válido es requerido\n';
    }
    if (!this.passwordStrength.isValid) {
      message += '• La contraseña no cumple con los requisitos de seguridad\n';
    }
    if (this.registerForm.get('confirmPassword')?.hasError('passwordMismatch')) {
      message += '• Las contraseñas no coinciden\n';
    }
    if (!this.acceptTerms) {
      message += '• Debes aceptar los términos y condiciones\n';
    }

    const alert = await this.alertController.create({
      header: 'Errores de validación',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrengthColor(): string {
    if (!this.registerForm.get('password')?.value) return 'medium';
    return this.passwordStrength.isValid ? 'success' : 'danger';
  }

  getPasswordStrengthValue(): number {
    const password = this.registerForm.get('password')?.value;
    if (!password) return 0;
    
    let score = 0;
    if (password.length >= 8) score += 0.2;
    if (/[A-Z]/.test(password)) score += 0.2;
    if (/[a-z]/.test(password)) score += 0.2;
    if (/[0-9]/.test(password)) score += 0.2;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 0.2;
    
    return score;
  }

  async showTermsAndConditions() {
    const alert = await this.alertController.create({
      header: 'Términos y Condiciones',
      message: `
        <h4>Términos de Uso - Derecho Familiar CL</h4>
        <p>Al usar esta aplicación, aceptas:</p>
        <ul>
          <li>Usar la información proporcionada solo con fines educativos</li>
          <li>No usar la aplicación para actividades ilegales</li>
          <li>Respetar la privacidad de otros usuarios</li>
          <li>Mantener la confidencialidad de tu cuenta</li>
        </ul>
        <p><strong>Nota:</strong> Esta aplicación proporciona información general sobre derecho familiar chileno y no constituye asesoría legal profesional.</p>
      `,
      buttons: ['Entendido']
    });
    await alert.present();
  }
}
