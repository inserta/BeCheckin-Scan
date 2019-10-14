import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../config/configService';
import { AbstractWS } from './abstractService';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Credenciales } from '../models/form.model';
import { DatosDocumento } from '../models/others.model';

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

  public getAllOfClientDate(idHotel: string, fechaIni, fechaFin) {
    const fd = new HttpParams()
    .set('client',idHotel)
    .set('fechaini',fechaIni)
    .set('fechafin',fechaFin);
    return this.makePostRequest(this.path + 'utils/getAllOfClientDate/', fd)
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
  
  public getReservaBooking(idHotel, idReserva) {
    
    let fd = new HttpParams()
    .set('idHotel',idHotel)
    .set('idReserva',idReserva);

    return this.makePostRequest(this.path+'/booking/reserva/', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public crearHuesped(name, email, tokenFirebase, keyRoom) {
    
    let fd = new HttpParams()
    .set('name',name)
    .set('email',email)
    .set('tokenFirebase',tokenFirebase)
    .set('keyRoom',keyRoom);

    return this.makePostRequest(this.pathInsinno+'createGuest', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public setFastcheckin(idGuest, fastcheckin) {
    
    let fd = new HttpParams()
    .set('guest',idGuest)
    .set('fastcheckin', encodeURIComponent(fastcheckin));

    return this.makePostRequestJson(this.pathInsinno+'setFastcheckin', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public getDatosReserva(idReserva) {
    
    let fd = new HttpParams();

    return this.makeGetRequest(this.path+'datosReserva/'+idReserva, fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }
  
  public crearOcrDniFrontal(text) {
    
    let fd = new HttpParams()
      .set('text',text);

    return this.makePostRequest(this.path+'ocr/dni/frontal', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }
  
  public crearOcrDniTrasero(text, datosDocumento: DatosDocumento) {
    
    let fd = new HttpParams()
      .set('text',text);
      
    if (datosDocumento) {
      if(datosDocumento.nombre){
        fd = fd.append('nombre', datosDocumento.nombre);
      }
      if(datosDocumento.apellido1){
        fd = fd.append('apellido1', datosDocumento.apellido1);
      }
      if(datosDocumento.apellido2){
        fd = fd.append('apellido2', datosDocumento.apellido2);
      }
      if(datosDocumento.documento){
        fd = fd.append('documento', datosDocumento.documento);
      }
      if(datosDocumento.pais){
        fd = fd.append('pais', datosDocumento.pais);
      }
      if(datosDocumento.nacimiento){
        fd = fd.append('nacimiento', datosDocumento.nacimiento);
      }
      if(datosDocumento.sexo){
        fd = fd.append('genero', datosDocumento.sexo);
      }
      if(datosDocumento.expedicion){
        fd = fd.append('expedicion', datosDocumento.expedicion);
      }
      if(datosDocumento.tipoDocumento){
        fd = fd.append('tipoDocumento', datosDocumento.tipoDocumento);
      }
    }

    return this.makePostRequest(this.path+'ocr/dni/trasero', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }
  
  public crearOcrPasaporte(text) {
    
    let fd = new HttpParams()
      .set('text',text);

    return this.makePostRequest(this.path+'ocr/pasaporte/', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public sendPushToMasteryield(downloadCode) {
    let license = downloadCode.substring(0,4);
    let fd = new HttpParams();
    return this.makeGetRequest('https://push.masteryield.com/channel_post.php?apikey=7a3680c5-9eb4-m52f-8775-440e31dbe0f2&license='+license+'&json='+downloadCode, fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }
}