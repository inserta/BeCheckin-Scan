import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from 'src/app/services/globalService';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  ready: boolean = false;

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  items: any[] = []

  reservas: string[] = [];
  buscarReserva: any;

  constructor(
    public modalController: ModalController,
    private nav: NavController,
    private loader: LoadingService,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    console.log(this.globalService.leerCookies());
    this.cargaReservas();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
  }

  index: number = 1;

  cargaReservas() {
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        this.items.push({
          name: this.index + ' - ',
          content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
        });
        this.index++;
      }
      this.ready = true;
    }, 1000);
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded

      for (let i = 0; i < 10; i++) {
        this.items.push({
          name: this.index + ' - ',
          content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
        });
        this.index++;
      }
      // and disable the infinite scroll
      if (this.items.length > 35) {
        event.target.disabled = true;
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