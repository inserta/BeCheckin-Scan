import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from 'src/app/services/globalService';
import { Router } from '@angular/router';
import { DatosReserva } from 'src/app/models/data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  ready: boolean = false;
  sinPermisos: boolean = false;
  datosReservas: DatosReserva[] = [];
  datosReservasFiltradas: DatosReserva[] = [];

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  items: any[] = []

  reservas: string[] = [];
  buscarReserva: any;

  //El siguiente índice definirá el máximo número de reservas que se mostrarán en la carga inicial.
  //Este índice se irá modificando para indicar el número de reservas que se están mostrando.
  index: number = 10;
  //El numReservasCargadas indica el número de reservas que se cargarán al realizar el scroll cada vez que lleguemos al final.
  numReservasCargadas = 10;

  constructor(
    public modalController: ModalController,
    private nav: NavController,
    private loader: LoadingService,
    private router: Router,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.datosReservas = [];
    this.datosReservasFiltradas = [];
    this.index = 10;
    this.numReservasCargadas = 10;
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    this.globalService.leerCookies(true).then(res => {
      if (!res) {
        this.sinPermisos = true;
        this.router.navigateByUrl("/login");
      } else {
        this.sinPermisos = false;
        //Los datos de las reservas ya están filtrados y ordenados.
        this.datosReservas = this.globalService.datosReservas;
        //Cargamos en otra variable una copia de los datos de las reservas obtenidos, únicamente para mostrar.
        for (let i = 0; i < this.index; i++) {
          if (this.datosReservasFiltradas.length == this.datosReservas.length) {
            break;
          } else {
            this.datosReservasFiltradas.push(this.datosReservas[i]);
          }
        }
        this.ready = true;
      }
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  loadData(event) {
    if (this.datosReservas.length == this.datosReservasFiltradas.length) {
      event.target.disabled = true;
    } else {
      setTimeout(() => {
        event.target.complete();
        // App logic to determine if all data is loaded
        for (let i = 0; i < this.numReservasCargadas; i++) {
          if (this.datosReservas.length == this.datosReservasFiltradas.length) {
            // disable the infinite scroll
            event.target.disabled = true;
            break;
          } else {
            this.datosReservasFiltradas.push(this.datosReservas[this.index]);
            this.index++;
          }
        }
      }, 500);
    }
  }


  muestraFechaString(fecha: Date): string {
    return this.leftpad(fecha.getDate(), 2) + "-" + this.leftpad(fecha.getMonth() + 1, 2) + '-' + fecha.getFullYear();
  }
  //Método utilizado para formatear la fecha en string
  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
      + String(val)).slice(String(val).length);
  }

  abrirFiltros() {
    this.nav.navigateRoot('/filtros');
  }

  abrirReserva() {
    this.loader.present();
    setTimeout(() => {
      this.nav.navigateForward('/reserva');
    }, 100);
  }

}