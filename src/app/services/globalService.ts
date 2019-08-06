import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataManagement } from '../services/dataManagement';
import { Router } from '@angular/router';
import { Recepcionista } from '../models/data.model';

@Injectable()
export class GlobalService {

  //Variables
  recepcionista: Recepcionista;

  constructor(
    private cookieService: CookieService,
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

  metodoDesarrollo(){

    let recepcionista = new Recepcionista();
    recepcionista.hotel = "1";
    recepcionista.usuario = "javi@becheckin.com";
    this.cookieService.set('token_scan', recepcionista._id);
    this.recepcionista = recepcionista;

  }
}