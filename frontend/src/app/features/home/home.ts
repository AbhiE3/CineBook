import { Component, inject } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { IconComponent } from "../../shared/icon";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [IconComponent],
  templateUrl: "./home.html",
  styleUrl: "./home.css"
})
export class HomeComponent {
  readonly auth = inject(AuthService);
}
