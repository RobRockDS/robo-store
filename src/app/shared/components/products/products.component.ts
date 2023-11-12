import { StoreService } from '../../../services/store.service';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../../../models/product.model';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ProductsService } from '../../../services/products.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  @Input() products: Product[] = [];
  //@Input() productId: string|null =null;
  @Input() set productId(id: string | null) {
    if (id) {
      this.onShowDetail(id);
    }
  }
  @Output() loadMore = new EventEmitter();
  myShoppingCart: Product[] = [];
  total = 0;
  showProductDetail = false;
  productShosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: '',
  };

  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
    if (!this.showProductDetail) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { product: null },
        queryParamsHandling: 'merge',
      });
    }
  }
  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    if (!this.showProductDetail) {
      this.showProductDetail = true;
    }
    console.log(this.showProductDetail);
    this.productsService.getOne(id).subscribe({
      next: (data: any) => {
        this.productShosen = data;
        this.statusDetail = 'success';
      },
      error: (response: any) => {
        this.toastrService.error(response);
      },
    });
  }

  //solucion al callback Hell
  readAndUpdate(id: string) {
    this.productsService
      .getProduct(id)
      .pipe(
        switchMap(product =>
          this.productsService.update(product.id, { title: 'change' }),
        ),
      )
      .subscribe(data => {
        //console.log(data);
      });

    this.productsService
      .fectchReadAndUpdate(id, { title: 'change' })
      .subscribe(response => {
        const read = response[0];
        const update = response[1];
      });
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'New Product',
      description: 'Nuevo',
      images: [
        'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
        'https://previews.123rf.com/images/aprillrain/aprillrain2212/aprillrain221200612/196177803-imagen-de-caricatura-de-un-astronauta-sentado-en-una-luna-ilustraci%C3%B3n-de-alta-calidad.jpg',
      ],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product).subscribe(data => {
      //console.log("Created: ",data)
      this.products.unshift(data);
      this.toastrService.success('Producto creado');
    });
  }
  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'Nuevo Producto',
    };
    const id = this.productShosen.id;
    this.productsService.update(id, changes).subscribe(data => {
      const productIndex = this.products.findIndex(
        item => item.id == this.productShosen.id,
      );
      this.products[productIndex] = data;
    });
  }
  deleteProduct() {
    const id = this.productShosen.id;
    this.productsService.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex(
        item => item.id === this.productShosen.id,
      );
      this.products.splice(productIndex);
      this.showProductDetail = false;
    });
  }
  onLoadMore() {
    this.loadMore.emit();
  }
}
