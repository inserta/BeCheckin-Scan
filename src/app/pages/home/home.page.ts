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
  index: number = 5;
  //El numReservasCargadas indica el número de reservas que se cargarán al realizar el scroll cada vez que lleguemos al final.
  numReservasCargadas = 5;

  constructor(
    public modalController: ModalController,
    private nav: NavController,
    private loader: LoadingService,
    private router: Router,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    this.globalService.leerCookies().then(res => {
      if(!res){
        this.sinPermisos = true;
        this.router.navigateByUrl("/login");
      } else {
        this.sinPermisos = false;
        //Los datos de las reservas ya están filtrados y ordenados.
        this.datosReservas = this.globalService.datosReservas;
        //Cargamos en otra variable una copia de los datos de las reservas obtenidos, únicamente para mostrar.
        for(let i = 0; i<this.index; i++){
          this.datosReservasFiltradas.push(this.datosReservas[i]);
        }
        this.ready = true;
      }
    });
    // this.cargaReservas();
  }

  // TODO: Borrar método
  // cargaReservas() {
  //   setTimeout(() => {
  //     for (let i = 0; i < 10; i++) {
  //       this.items.push({
  //         name: this.index + ' - ',
  //         content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
  //       });
  //       this.index++;
  //     }
  //     this.ready = true;
  //   }, 1000);
  // }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      for (let i = 0; i < this.numReservasCargadas; i++) {
        this.datosReservasFiltradas.push(this.datosReservas[this.index]);
        if(this.datosReservas.length == this.datosReservasFiltradas.length){
          // disable the infinite scroll
          event.target.disabled = true;
          break;
        }
        this.index++;
      }
    }, 500);
  }

  // toggleInfiniteScroll() {
  //   this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  // }
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
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

window.addEventListener( "pageshow", function ( event ) {
  this.console.log("entrando en listener");
  var historyTraversal = event.persisted || 
                         ( typeof window.performance != "undefined" && 
                              window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.

    window.location.reload();
  }
});