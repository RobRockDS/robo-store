import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { retry, catchError, map, switchMap } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from './../models/product.model';
import { checkTime } from './../interceptors/time.interceptor';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api`;

  constructor(private http: HttpClient) {}
  getByCategory(categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit.toString());
      params = params.set('offset', offset.toString());
    }
    return this.http.get<Product[]>(
      `${this.apiUrl}/categories/${categoryId}/products`,
      { params },
    );
  }

  //recuperar datos
  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit.toString());
      params = params.set('offset', offset.toString());
    }
    return this.http
      .get<Product[]>(`${this.apiUrl}/products`, {
        params,
        context: checkTime(),
      })
      .pipe(
        retry(3),
        map(products =>
          products.map(item => {
            return {
              ...item,
              impuesto: 0.12 * item.price,
            };
          }),
        ),
      );
  }
  getOne(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          throw new Error('Algo esta fallando en el server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          throw new Error('El producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          throw new Error('No estas permitido');
        }
        throw new Error('Ups algo salio mal');
      }),
    );
  }

  fectchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(this.getProduct(id), this.update(id, dto));
  }

  fetchReadAndUpdateWithSwitchMap(id: string, dto: UpdateProductDTO) {
    return this.getProduct(id).pipe(
      switchMap(product => this.update(product.id, dto)),
    );
  }

  //recuperacion mediante una codigo de un producto
  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          throw new Error('Error de conexion');
        }
        if (error.status === HttpStatusCode.NotFound) {
          throw new Error('Producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          throw new Error('No estas permitido para ingresar aca');
        }
        throw new Error('Error');
      }),
    );
  }
  //Recupera para paginado
  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      params: { limit, offset },
    });
  }
  //Enviar datos para su registro
  create(dto: CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}/products`, dto);
  }
  //Actualizar put(enviar todos los atributos) y patch (Solo un atributo en particular)
  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }
  //delete
  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
