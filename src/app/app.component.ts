import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './utilities/services/theme-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PitPlanFront';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.initTheme();
  }
}
