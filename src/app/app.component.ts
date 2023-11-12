import { UsersService } from './services_login/users.service';
import { Component, OnInit } from '@angular/core';
import { Product } from './models/product.model';
import { FilesService } from './services/files.service';
import { AuthService } from './services_login/auth.service';
import { TokenService } from './services_login/token.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  imgParent = './assets/images/default.png';

  constructor(
    private usersService: UsersService,
    private filesService: FilesService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}
  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      this.authService.getProfile().subscribe();
    }
  }

  createUser() {
    this.usersService
      .create({
        name: 'Robo',
        email: 'robo@gmail.com',
        password: '1234',
        role: 'admin',
      })
      .subscribe(rta => {
        console.log(rta);
      });
  }
  downloadPdf() {
    this.filesService
      .getFile('my.txt', './../assets/files/files.txt', 'text/plain')
      .subscribe();
  }
}
