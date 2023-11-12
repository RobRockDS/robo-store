import { StoreService } from './../../../services/store.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../services_login/auth.service';
import { UsersService } from './../../../services_login/users.service';
import { User } from './../../../models/user.model';
import { switchMap } from 'rxjs/operators';
import { CategoriesService } from './../../../services/categories.service';
import { Category } from './../../../models/category.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu = false;
  counter = 0;
  email: string = 'admin@mail.com';
  pass: string = 'admin123';
  profile: User | null = null;
  categories: Category[] = [];
  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
    this.getAllCategories();
    this.authService.user$.subscribe(data => {
      this.profile = data;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService
      .loginAndGet(this.email, this.pass)
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }

  getAllCategories() {
    this.categoriesService.getAll().subscribe(data => {
      this.categories = data;
    });
  }
  logout() {
    this.authService.logout();
    this.profile = null;
    this.router.navigate(['/home']);
  }
}
