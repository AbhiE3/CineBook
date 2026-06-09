import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { IconComponent } from "../../shared/icon";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: "./login.html",
  styleUrl: "./login.css"
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = "";
  password = "";
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    if (!this.username || !this.password) {
      this.error.set("Please enter your username and password");
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(["/"]),
      error: (err) => {
        this.error.set(err?.error?.message ?? "Login failed");
        this.loading.set(false);
      }
    });
  }
}
