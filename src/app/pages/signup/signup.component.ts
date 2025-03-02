import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-signup',
  imports: [  RouterLink,
  FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatIconModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone:true
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  
  onSignup() {
    this.authService.register(this.name, this.email, this.password).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      (error:any) => {
        alert('Error signing up');
      }
    );
  }

}
