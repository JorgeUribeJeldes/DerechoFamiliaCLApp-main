import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage {
  formularioLogin: FormGroup;
  errorLogin: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.formularioLogin = this.fb.group({
      correo: ['', [Validators.required]], // Removido Validators.email para permitir usernames
      clave: ['', Validators.required]
    });
  }

  async login() {
    if (this.formularioLogin.valid) {
      this.isLoading = true;
      this.errorLogin = false;

      const datos = this.formularioLogin.value;
      
      try {
        const success = await this.authService.login(datos.correo, datos.clave);
        
        if (success) {
          // Esperar un poco para que se complete la autenticación
          setTimeout(async () => {
            try {
              await this.router.navigate(['/inicio']);
            } catch (navError) {
              console.error('Error en navegación:', navError);
            }
          }, 100);
          
        } else {
          this.errorLogin = true;
        }
      } catch (error) {
        console.error('Error en login:', error);
        this.errorLogin = true;
      } finally {
        // Desactivar loading después de un breve delay para permitir navegación
        setTimeout(() => {
          this.isLoading = false;
        }, 200);
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.formularioLogin.controls).forEach(key => {
        this.formularioLogin.get(key)?.markAsTouched();
      });
    }
  }

  // Método para login rápido demo
  async loginDemo() {
    this.formularioLogin.patchValue({
      correo: 'usuario',
      clave: '1234'
    });
    
    // Resetear estados
    this.errorLogin = false;
    this.isLoading = true;
    
    try {
      const success = await this.authService.login('usuario', '1234');
      
      if (success) {
        setTimeout(async () => {
          await this.router.navigate(['/inicio']);
        }, 100);
      } else {
        this.errorLogin = true;
      }
    } catch (error) {
      console.error('Error en demo login:', error);
      this.errorLogin = true;
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 200);
    }
  }
}
