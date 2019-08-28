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
  pathInsinnoGuest = '';
  pathBooking = '';

  constructor(
    private config: ConfigService,
    http: HttpClient,
    private cookieService: CookieService
  ) {
    super(http);
    this.path = this.config.config().restUrlPrefix;
    this.pathInsinno = this.config.configInsinno().restUrlPrefix;
    this.pathInsinnoGuest = this.config.configInsinno().restUrlPrefixGuest;
    this.pathBooking = this.config.configBooking().restUrlPrefix;
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

  public getHotel(idCliente: string) {
    const fd = new HttpParams()
    .set('idCliente',idCliente);
    return this.makePostRequest(this.path + 'populate', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public subirArchivo(body) {
    return this.makePostRequest('https://dashboard.becheckin.com/php/fileUploadHotel.php', body)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public setPermissionPersonalData(idGuest: string, idClient: string, client: string, response: string) {
    
    const fd = new HttpParams()
    .set('idGuest',idGuest)
    .set('idClient',idClient)
    .set('client',client)
    .set('response',response);

    return this.makePostRequest(this.pathInsinnoGuest+'personalDataPermissions', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public sendGenericMail(asunto, mensaje, mailTo, cc?, cco?) {
    
    let fd = new HttpParams()
    .set('asunto',asunto)
    .set('mensaje',mensaje)
    .set('mailTo',mailTo);

    if (cc) {
      fd = fd.append('cc', cc);
    }
    if (cco) {
      fd = fd.append('cc', cco);
    }

    return this.makePostRequest(this.path+'gmail', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }
  
  public getReservationHotel(idHotel, idBooking) {
    
    let fd = new HttpParams();

    return this.makeGetRequest(this.pathBooking+'/hotels/'+idHotel+"/reservations/"+idBooking, fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

}