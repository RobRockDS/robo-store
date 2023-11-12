import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';
import { Observable,of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomPreloadService {
  constructor() {}
  preload(route: Route, load: () => Observable<any>):Observable<any> {
    if(route.data && route.data['preload']){
      return load();
    }
    return of(null)
  }
}
