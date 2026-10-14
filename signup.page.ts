import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage {
  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onSubmit() {
    if (this.signupForm.invalid) return;

    const { email, password } = this.signupForm.value;
    const success = await this.auth.signup(email!, password!);

    if (success) {
      this.router.navigate(['/login']);
      const toast = await this.toastCtrl.create({
        message: 'Signup successful! Please login',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Signup failed. Email may be taken',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }
}