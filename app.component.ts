import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router) {
    this.initializeApp();
  }

  async initializeApp() {
    const isLoggedIn = await this.auth.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
}