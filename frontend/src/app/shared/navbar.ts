import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { LocationService } from "../core/services/location.service";
import { IconComponent } from "./icon";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css"
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly location = inject(LocationService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}
