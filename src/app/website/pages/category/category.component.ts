import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductsService } from './../../../services/products.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-category',
  template:`<app-products [productId]="productId" [products]="products" (loadMore)="onLoadMore()"></app-products>`,
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categoryId: string | null = null;
  limit = 10;
  offset = 0;
  productId: string | null = null;
  products: Product[] = [];
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
  ) {}
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.categoryId = params.get('id');
          if (this.categoryId) {
            return this.productsService.getByCategory(
              this.categoryId,
              this.limit,
              this.offset,
            );
          }
          return [];
        }),
      )
      .subscribe(data => {
        this.products = data;
      });

      this.route.queryParamMap.subscribe(params => {
        this.productId = params.get('product');
        console.log(this.productId);
      });
  }
  onLoadMore() {
    this.productsService
      .getAllProducts(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }
}
