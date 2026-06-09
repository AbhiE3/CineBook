import { Component, Input } from "@angular/core";

export type IconName =
  | "film"
  | "ticket"
  | "user"
  | "lock"
  | "log-out"
  | "map-pin"
  | "chevron-down"
  | "loader";

/**
 * Lightweight inline-SVG icon set (Lucide-style). Grows on later days.
 * Usage: <app-icon name="film" class="h-5 w-5" />
 */
@Component({
  selector: "app-icon",
  standalone: true,
  templateUrl: "./icon.html",
  styleUrl: "./icon.css"
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
}
