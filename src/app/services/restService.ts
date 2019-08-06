import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../config/configService';
import { AbstractWS } from './abstractService';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Credenciales } from '../models/form.model';

@Injectable()
export class RestWS extends AbstractWS {
  path = '';

  constructor(
    private config: ConfigService,
    http: HttpClient,
    private cookieService: CookieService
  ) {
    super(http);
    this.path = this.config.config().restUrlPrefix;
  }

  public login(credenciales: Credenciales) {
    const fd = new HttpParams()
      .set('usuario', credenciales.usuario)
      .set('clave',credenciales.clave);
    return this.makePostRequest(this.path + 'login/recepcion/', fd)
      .then(res => {
        console.log('Logged successfully');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

}