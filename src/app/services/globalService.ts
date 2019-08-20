import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataManagement } from '../services/dataManagement';
import { Router } from '@angular/router';
import { Recepcionista, Cookies, Hotel } from '../models/data.model';
import { LoadingService } from './loading.service';

@Injectable()
export class GlobalService {

  //Variables
  recepcionista: Recepcionista;
  hotel: Hotel;


  cookies: Cookies;

  constructor(
    private cookieService: CookieService,
    private loader: LoadingService,
    private dm: DataManagement,
    private router: Router
  ) {
    this.initialize();
  }

  private initialize() {

    //Inicializamos variables
    this.recepcionista = null;

    //Método para la recarga de datos al recompilar
    this.metodoDesarrollo();

  }

  metodoDesarrollo() {

    let recepcionista = new Recepcionista();
    recepcionista.hotel = "1";
    recepcionista.usuario = "javi@becheckin.com";
    this.cookieService.set('token_scan', recepcionista._id);
    this.recepcionista = recepcionista;

  }

  leerCookies() {
    return new Promise<boolean>((resolve, reject) => {
      //Comprobamos si existen las cookies
      if (this.cookieService.get('directScanData')) {
        let cargarDatos: boolean = false;
        //En caso de existir, cogemos todos los datos y los guardamos en la variable global.
        this.cookies = JSON.parse(this.cookieService.get('directScanData'));

        //Comprobamos que las cookies básicas existen, en caso contrario devolvemos false.
        if (!this.cookies.idHotel || !this.cookies.idRecepcionista) {
          resolve(false);
        }
        //Comprobamos si existe un recepcionista
        if (!this.recepcionista) {
          cargarDatos = true;
        } else if (!this.recepcionista._id) {
          cargarDatos = true;
        }
        //En caso de no tener un recepcionista, cargaremos todos los datos de la aplicación en base a las cookies obtenidas
        if (cargarDatos) {
          if (!this.loader.isLoading) {
            //Inicializamos el icono de carga
            this.loader.present();
          }
          setTimeout(() => {
            //Cargamos todos los datos.
            this.cargarDatos(this.cookies).then(res => {
              //Paramos el icono de carga
              this.loader.dismiss();
              //Comprobamos que los datos se han cargado correctamente.
              if(res){
                resolve(true);
              } else {
                resolve(false);
              }
            });
          }, 1500);
        } else {
          //En caso de tener las cookies y el recepcionista, asumimos que todos los datos están bien cargados y devolvemos true.
          resolve(true);
        }
      } else {
        //En caso de no existir, devolvemos false.
        resolve(false);
      }
    });
  }

  guardarCookies(cookies: Cookies) {
    this.cookies = cookies;
    this.cookieService.set('directScanData', JSON.stringify(cookies));
  }

  /**
   * Método de carga de datos en la aplicación
   * @param cookies Elemento de tipo "Cookies"
   * @param recepcionista Opcional, si se recibe se cargan directamente los datos del recepcionista sin llamar a la API.
   */
  cargarDatos(cookies: Cookies, recepcionista?: Recepcionista) {
    return new Promise<boolean>((resolve, reject) => {
      let promises = [];

      if(!recepcionista){
        promises.push(this.dm.getRecepcionista(cookies.idRecepcionista));
      }

      promises.push(this.dm);

      Promise.all(promises).then(res => {
        console.log(res);
        resolve(true);
      }).catch(res => {
        resolve(false);
      });
    });
  }
}