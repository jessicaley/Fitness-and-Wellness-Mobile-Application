import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageInitialized = false;

  constructor(private storage: Storage) {
    this.initializeStorage();
  }

  private async initializeStorage() {
    await this.storage.create();
    this.storageInitialized = true;
  }

  async signup(email: string, password: string) {
    if (!this.storageInitialized) await this.initializeStorage();
    await this.storage.set('user', { email, password });
    return true;
  }

  async login(email: string, password: string): Promise<boolean> {
    if (!this.storageInitialized) await this.initializeStorage();
    
    try {
      const user = await this.storage.get('user');
      if (!user) return false;
      
      // Trim and case-insensitive comparison
      const emailMatch = user.email.trim().toLowerCase() === email.trim().toLowerCase();
      const passwordMatch = user.password === password;
      
      return emailMatch && passwordMatch;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }


  async isLoggedIn() {
    if (!this.storageInitialized) await this.initializeStorage();
    return this.storage.get('user').then(user => !!user);
  }

  async logout() {
    if (!this.storageInitialized) await this.initializeStorage();
    await this.storage.remove('user');
  }
}

