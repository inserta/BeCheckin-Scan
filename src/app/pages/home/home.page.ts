import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from 'src/app/services/globalService';
import { Router, ActivatedRoute } from '@angular/router';
import { DatosReserva } from 'src/app/models/data.model';
import { DateFormatPipe } from 'src/app/pipes/dateFormat/dateFormatPipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  ready: boolean;
  iniciado: boolean;
  sinPermisos: boolean;

  //Reservas que se muestran.
  datosReservasMostrados: DatosReserva[];
  //Reservas totales encontradas en el hotel que han pasado los filtros básicos.
  datosReservasCompletos: DatosReserva[];
  //Reservas filtradas por el parámetro "buscarReserva".
  datosReservasFiltrados: DatosReserva[];

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  //Activa el filtro por nombre, email, telefono y documentos de cada reserva.
  //El documento se busca directamente desde el fastcheckin de la reserva.
  buscarReserva: string;

  //El siguiente índice definirá el máximo número de reservas que se mostrarán en la carga inicial.
  //Este índice se irá modificando para indicar el número de reservas que se están mostrando.
  index: number;
  //El numReservasCargadas indica el número de reservas que se cargarán al realizar el scroll cada vez que lleguemos al final.
  numReservasCargadas: number;

  //La variable fechaFiltro se usa para mostrar la fecha (o fechas) que componen el filtro en cada momento.
  fechaFiltro: string = "";

  constructor(
    public modalController: ModalController,
    private nav: NavController,
    private loader: LoadingService,
    private router: Router,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private dateFormatPipe: DateFormatPipe
  ) { }

  ngOnInit() {
    this.ready = false;
    this.iniciado = false;
    this.datosReservasMostrados = [];
    this.datosReservasFiltrados = [];
    this.datosReservasCompletos = [];
    this.buscarReserva = "";
    this.index = 10;
    this.numReservasCargadas = 10;
    this.sinPermisos = false;
  }

  ionViewWillEnter() {
    this.ready = false;
    let cargarDatos = false;
    //Escribimos la fecha del filtro seleccionada.
    this.escribeFechaFiltro();

    //Comprobamos si llega el parámetro cargarDatos por url para forzar la carga de datos tras haber realizado cambios en los filtros.
    if (this.route.snapshot.queryParamMap.get('cargarDatos')) {
      cargarDatos = this.route.snapshot.queryParamMap.get('cargarDatos') == 'true';
    }
    //Llamamos al método leer cookies
    //Le pedimos que no muestre el icono de carga, ya que esta pantalla posee otro icono distinto.
    this.globalService.leerCookies(true, cargarDatos).then(res => {
      // Si devuelve falso es porque no tenemos la sesión iniciada, o no tenemos acceso a esta sección.
      // Por lo que redirigimos a la pantalla de login.
      if (!res) {
        this.sinPermisos = true;
        this.router.navigateByUrl("/login");
      } else {
        this.sinPermisos = false;
        // Los datos de las reservas ya están filtrados y ordenados.
        // Comprobamos si la página ya ha sido inicializada anteriormente antes de cargar todos los datos en las variables.
        if (!this.iniciado) {
          this.globalService.datosReservas.forEach(datosRes => {
            this.datosReservasFiltrados.push(datosRes);
            this.datosReservasCompletos.push(datosRes);
          });
          // Recorremos tan sólo el número indicado por el index para mostrar las "x" primeras reservas, e ir cargando las demás posteriormente poco a poco.   
          for (let i = 0; i < this.index; i++) {
            if (this.datosReservasFiltrados.length == this.datosReservasMostrados.length) {
              break;
            } else {
              //Cargamos en otra variable una copia de los datos de las reservas obtenidos, únicamente para mostrar.
              this.datosReservasMostrados.push(this.datosReservasFiltrados[i]);
            }
          }
          this.iniciado = true;
        }

        this.ready = true;
      }
    });
  }

  doRefresh(event) {
    this.ready = false;
    // Refrescar todos los datos de las reservas
    this.globalService.cargarDatos(this.globalService.cookies).then(res => {
      event.target.complete();
      this.datosReservasMostrados = [];
      this.datosReservasFiltrados = [];
      this.datosReservasCompletos = [];
      this.globalService.datosReservas.forEach(datosRes => {
        this.datosReservasFiltrados.push(datosRes);
        this.datosReservasCompletos.push(datosRes);
      });
      // Recorremos tan sólo el número indicado por el index para mostrar las "x" primeras reservas, e ir cargando las demás posteriormente poco a poco.   
      for (let i = 0; i < this.index; i++) {
        if (this.datosReservasFiltrados.length == this.datosReservasMostrados.length) {
          break;
        } else {
          //Cargamos en otra variable una copia de los datos de las reservas obtenidos, únicamente para mostrar.
          this.datosReservasMostrados.push(this.datosReservasFiltrados[i]);
        }
      }
      this.filtrarReservas();
      this.ready = true;
    });
  }

  loadData(event) {
    if (this.datosReservasMostrados.length == this.datosReservasFiltrados.length) {
      event.target.disabled = true;
    } else {
      setTimeout(() => {
        event.target.complete();
        // App logic to determine if all data is loaded
        for (let i = 0; i < this.numReservasCargadas; i++) {
          if (this.datosReservasMostrados.length == this.datosReservasFiltrados.length) {
            // disable the infinite scroll
            event.target.disabled = true;
            break;
          } else {
            this.datosReservasMostrados.push(this.datosReservasFiltrados[this.index]);
            this.index++;
          }
        }
      }, 500);
    }
  }

  escribeFechaFiltro() {

    this.fechaFiltro = "";
    if (this.cookieService.get('directScanData') && this.cookieService.get('directScanData') != "null") {
      let cookies = JSON.parse(this.cookieService.get('directScanData'));
      let fechaIni = new Date(cookies.filtros.fechaInicial);
      let fechaFin = new Date(cookies.filtros.fechaFinal);
      let hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fechaIni.setHours(0, 0, 0, 0);
      fechaFin.setHours(0, 0, 0, 0);

      if (fechaIni > fechaFin || fechaFin > fechaIni) {
        this.fechaFiltro = "Del " + this.dateFormatPipe.transform(fechaIni) + " al " + this.dateFormatPipe.transform(fechaFin);
      } else {
        if (fechaIni < hoy || fechaIni > hoy) {
          this.fechaFiltro = this.dateFormatPipe.transform(fechaIni);
        } else {
          this.fechaFiltro = "HOY";
        }
      }
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

  abrirReserva(idReserva) {
    this.loader.present();
    setTimeout(() => {
      this.nav.navigateForward('/reserva/' + idReserva);
    }, 100);
  }

  filtrarReservas() {
    this.datosReservasFiltrados = this.datosReservasCompletos.filter(reserva => {
      let res = false;
      res = reserva.reserva.id.toString().toLowerCase().includes(this.buscarReserva.toLowerCase());
      return res;
    });
    this.datosReservasMostrados = [];
    for (let i = 0; i < this.index; i++) {
      if (this.datosReservasFiltrados.length == this.datosReservasMostrados.length) {
        break;
      } else {
        //Cargamos en otra variable una copia de los datos de las reservas obtenidos, únicamente para mostrar.
        this.datosReservasMostrados.push(this.datosReservasFiltrados[i]);
      }
    }
  }
}