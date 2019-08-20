import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../config/configService';
import { AbstractWS } from './abstractService';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Credenciales } from '../models/form.model';

@Injectable()
export class RestWS extends AbstractWS {
  path = '';
  pathInsinno = '';

  constructor(
    private config: ConfigService,
    http: HttpClient,
    private cookieService: CookieService
  ) {
    super(http);
    this.path = this.config.config().restUrlPrefix;
    this.pathInsinno = this.config.configInsinno().restUrlPrefix;
  }

  public login(credenciales: Credenciales) {
    const fd = new HttpParams()
      .set('usuario', credenciales.usuario)
      .set('clave',credenciales.clave);
    return this.makePostRequest(this.path + 'login_recepcionista/', fd)
      .then(res => {
        console.log('Logged successfully');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public getRecepcionista(id: string) {
    const fd = new HttpParams();
    return this.makeGetRequest(this.path + 'recepcionista/' + id, fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public getHijosHotel(padre: string) {
    const fd = new HttpParams()
    .set('activo',padre);
    return this.makePostRequest(this.path + 'getHijos/', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public getAllOfClient(idHotel: string) {
    const fd = new HttpParams()
    .set('client',idHotel);
    return this.makePostRequest(this.pathInsinno + 'getAllOfClient/', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

}