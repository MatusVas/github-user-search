import { Component, computed } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../icon/icon.component';

/**
 * Header component with logo and theme toggle
 * Displays the application name and allows users to switch between light/dark themes
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  themeLabel = computed(() => this.themeService.theme() === 'light' ? 'DARK' : 'LIGHT');
  themeIcon = computed(() => this.themeService.theme() === 'light' ? 'moon' : 'sun');

  constructor(public themeService: ThemeService) {}

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
