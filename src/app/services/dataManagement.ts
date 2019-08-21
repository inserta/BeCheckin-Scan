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
   * Obtener datos del cliente
   * @param id Id del hotel 
   */
  public getCliente(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let promises = [];
      promises.push(this.restService.getHijosHotel(id));
      promises.push(this.restService.getAllOfClient(id));
      Promise.all(promises).then(res=>{
        resolve(res);
      })
    });
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
}