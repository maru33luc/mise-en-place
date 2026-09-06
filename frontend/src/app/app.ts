import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { AlertComponent } from '@shared/alert/alert.component';

/**
 * Shell raíz de la app. Todo el dominio recetas vive en el feature lazy
 * cargado vía router; este componente solo expone el outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AlertComponent],
  template: `<app-navbar /><app-alert /><router-outlet />`,
})
export class App {}