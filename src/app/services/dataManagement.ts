import { Injectable } from '@angular/core';
import { RestWS } from './restService';
import { Credenciales } from '../models/form.model';
import { DatosReservaServidor } from '../models/data.model';
import { DatosDniFrontal } from '../models/others.model';

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
   * Función optimizada para obtener todos los datos necesarios del cliente y reservas
   * @param id Id del hotel 
   * @param fechaIni Fecha inicial de búsqueda para la reserva (yyyy-mm-dd)
   * @param fechaFin Fecha final de búsqueda para la reserva (yyyy-mm-dd)
   */
  public getAllOfClientByDate(id: string, fechaIni: string, fechaFin: string): Promise<any> {
    return this.restService.getAllOfClientDate(id, fechaIni, fechaFin).then(data => {
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
   * Creación de huesped previo al fastcheckin.
   * @param name Nombre del huesped.
   * @param email Email del huesped, debe ser único.
   * @param tokenFirebase Token generado aleatoriamente.
   * @param keyRoom "_id" de la llave.
   */
  public crearHuespedSinFastcheckin(name, email, tokenFirebase, keyRoom): Promise<any> {
    return this.restService
      .crearHuesped(name, email, tokenFirebase, keyRoom)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Método que incluye o modifica el fastcheckin de un huésped.
   * @param idGuest _id del huésped.
   * @param fastcheckin Debe ir encriptado.
   */
  public setFastcheckin(idGuest, fastcheckin): Promise<any> {
    return this.restService
      .setFastcheckin(idGuest, fastcheckin)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Método que nos devuelve los datos de la reserva almacenados en la BD.
   * @param llave Llave asociada a la reserva.
   */
  public getDatosReserva(llave): Promise<any> {
    return this.restService
      .getDatosReserva(llave.downloadCode)
      .then(data => {
        let datosReservaServidor: DatosReservaServidor = data[0];
        if(datosReservaServidor){
          if(!datosReservaServidor.numero_reserva){
            datosReservaServidor.numero_reserva = llave.downloadCode;
          }
          if(!datosReservaServidor.checkin){
            datosReservaServidor.checkin =  llave.start;
          }
          if(!datosReservaServidor.checkout){
            datosReservaServidor.checkout =  llave.finish;
          }
          if(!datosReservaServidor.idReserva){
            datosReservaServidor.idReserva =  llave._id;
          }
        } else {
          datosReservaServidor = new DatosReservaServidor();
          datosReservaServidor.numero_reserva = llave.downloadCode;
          datosReservaServidor.checkin =  llave.start;
          datosReservaServidor.checkout =  llave.finish;
          datosReservaServidor.idReserva =  llave._id;
        }
        return Promise.resolve(datosReservaServidor);
        
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Método que analiza la imagen mediante el OCR para el DNI Frontal.
   * @param text textos encontrados en la imagen por Google.
   */
  public crearOcrDniFrontal(text): Promise<any> {
    return this.restService
      .crearOcrDniFrontal(text)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Método que analiza la imagen mediante el OCR para el DNI Trasero.
   * @param text textos encontrados en la imagen por Google.
   */
  public crearOcrDniTrasero(text, datosDniFrontal: DatosDniFrontal): Promise<any> {
    return this.restService
      .crearOcrDniTrasero(text, datosDniFrontal)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  /**
   * Método que analiza la imagen mediante el OCR para el pasaporte.
   * @param text textos encontrados en la imagen por Google.
   */
  public crearOcrPasaporte(text): Promise<any> {
    return this.restService
      .crearOcrPasaporte(text)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

}