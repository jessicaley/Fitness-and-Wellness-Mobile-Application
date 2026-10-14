import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm = this.fb.group({
    email: ['test@example.com', [Validators.required, Validators.email]],
    password: ['password123', Validators.required]
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController 
  ) {}

  async onSubmit() {
    if (this.loginForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all fields correctly',
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
      return;
    }
  
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...'
    });
    await loading.present();
  
    try {
      const { email, password } = this.loginForm.value;
      const success = await this.auth.login(email!, password!);
  
      if (success) {
        await this.router.navigate(['/tabs'], { replaceUrl: true });
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Invalid credentials',
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Login error:', error);
      const toast = await this.toastCtrl.create({
        message: 'Login failed. Please try again',
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }
  
}