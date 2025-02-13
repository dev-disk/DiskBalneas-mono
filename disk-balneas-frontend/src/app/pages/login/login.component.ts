import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  loginForm!: FormGroup;
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submitLogin(): void {
    const formValue = this.loginForm.value;

    this.loginService.login(formValue.login, formValue.password).subscribe({
      next: (response) => {
        if (response.status === 'OK') {
          this.router.navigate(['/statistics']);
        }
        this.snackBar.open('Usuário Logado com Sucesso!', 'Fechar', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Credenciais Inválidas!', error);
        this.snackBar.open(
          'Credenciais inválidas!', 'Fechar', {
            duration: 3000,
          }
        )
      },
    });
  }

  hide = signal(true);
  clickEvent(event: Event) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
