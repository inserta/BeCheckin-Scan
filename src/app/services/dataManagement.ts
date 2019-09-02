import { Injectable } from '@angular/core';
import { RestWS } from './restService';
import { Credenciales } from '../models/form.model';

@Injectable()
export class DataManagement {
  constructor(private restService: RestWS) { }


  // LOGIN

  public login(credenciales: Credenciales): Promise<any> {
    return this.restService
      .login(credenciales)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Obtener datos del recepcionista
   * @param id Id del recepcionista 
   */
  public getRecepcionista(id: string): Promise<any> {
    return this.restService
      .getRecepcionista(id)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Obtener datos del cliente (llaves)
   * @param id Id del hotel 
   */
  public getCliente(id: string): Promise<any> {
    return this.restService.getAllOfClient(id).then(data => {
      return Promise.resolve(data);
    }).catch(error => {
      return Promise.reject('error');
    })
  }

  /**
   * Obtener datos del hotel
   * @param idCliente Id del cliente 
   */
  public getHotel(idCliente: string): Promise<any> {
    return this.restService
      .getHotel(idCliente)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Subir archivos a servidor
   * @param body Parámetros de la subida (FormData) con selectFile, path y remotename.
   */
  public subirArchivo(body): Promise<any> {
    return this.restService
      .subirArchivo(body)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * 
   * @param idGuest 
   * @param idClient 
   * @param client 
   * @param response 
   */
  public setPermissionPersonalData(idGuest: string, idClient: string, client: string, response: string): Promise<any> {
    return this.restService
      .setPermissionPersonalData(idGuest, idClient, client, response)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Enviar correo electrónico desde servidor, se envía desde la dirección "booking@becheckin.com".
   * @param asunto 
   * @param mensaje 
   * @param mailTo 
   * @param cc Opcional
   * @param cco Opcional
   */
  public sendGenericMail(asunto, mensaje, mailTo, cc?, cco?): Promise<any> {
    return this.restService
      .sendGenericMail(asunto, mensaje, mailTo, cc, cco)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Obtener reserva de booking
   * @param idHotel 
   * @param idBooking 
   */
  public getReservaBooking(idHotel, idBooking): Promise<any> {
    return this.restService
      .getReservaBooking(idHotel, idBooking)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Creación de huesped más fastcheckin en un sólo paso.
   * @param name Nombre del huesped.
   * @param email Email del huesped, debe ser único.
   * @param tokenFirebase Token generado aleatoriamente.
   * @param fastcheckin Datos de fastcheckin encriptados.
   * @param keyRoom "_id" de la llave.
   */
  public crearHuesped(name, email, tokenFirebase, fastcheckin, keyRoom): Promise<any> {
    return this.restService
      .crearHuesped(name, email, tokenFirebase, fastcheckin, keyRoom)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

}