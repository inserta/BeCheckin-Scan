import { Component, OnInit, Input } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatosReserva } from 'src/app/models/data.model';
import { GlobalService } from 'src/app/services/globalService';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  idReserva: string;
  sinPermisos: boolean;

  datosReserva: DatosReserva;

  nombre: string;
  email: string;
  telefono: string;

  ready: boolean;

  constructor(
    private loader: LoadingService,
    private nav: NavController,
    private globalService: GlobalService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.inicializaReserva();
    this.globalService.leerCookies(true).then(res => {
      if (!res) {
        this.sinPermisos = true;
        this.nav.navigateForward("/login");
      } else {
        //Filtramos las reservas por su id para obtener la reserva seleccionada
        let datosReservas = this.globalService.datosReservas.filter(datosReserva =>
          datosReserva.reserva.id.toString() == this.idReserva
        )
        //Puesto que nos devuelve una lista de un único elemento, lo sacamos de la lista y lo guardamos en una variable.
        this.datosReserva = datosReservas[0];
        this.rellenaDatosReserva();
        this.ready = true;
        console.log("resultado", res);
        console.log("idReserva", this.idReserva);
      }
    });
    console.log("ngOnInit reserva");
  }

  rellenaDatosReserva() {
    if (this.datosReserva.reserva) {
      if (this.datosReserva.reserva.primaryGuest) {
        if (this.datosReserva.reserva.primaryGuest.firstname) {
          this.nombre = this.datosReserva.reserva.primaryGuest.firstname;
        } else {
          //En caso de no encontrar el nombre en primaryGuest buscamos los datos en booker.
          this.rellenaDatosReservaAux("nombre");
        }
        if (this.datosReserva.reserva.primaryGuest.email) {
          this.email = this.datosReserva.reserva.primaryGuest.email;
        } else {
          //En caso de no encontrar el email en primaryGuest buscamos los datos en booker.
          this.rellenaDatosReservaAux("email");
        }
      } else {
        //En caso de no encontrar primaryGuest buscamos los datos en booker.
        this.rellenaDatosReservaAux("nombre");
        this.rellenaDatosReservaAux("email");
      }
      //Los datos del teléfono solo se encuentran en booker.
      this.rellenaDatosReservaAux("telefono");
    }
  }

  rellenaDatosReservaAux(atributo: string) {
    if (this.datosReserva.reserva.booker) {
      switch (atributo) {
        case "nombre":
          if (this.datosReserva.reserva.booker.firstname) {
            this.nombre = this.datosReserva.reserva.booker.firstname;
            if (this.datosReserva.reserva.booker.lastname) {
              this.nombre = this.nombre + ' ' + this.datosReserva.reserva.booker.lastname;
            }
          }
          break;
        case "telefono":
          if (this.datosReserva.reserva.booker.phone) {
            this.telefono = this.datosReserva.reserva.booker.phone;
          }
          break;
        case "email":
          if (this.datosReserva.reserva.booker.email) {
            this.email = this.datosReserva.reserva.booker.email;
          }
          break;

        default:
          break;
      }
    }
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter reserva");
  }

  nuevoHuesped() {
    this.nav.navigateForward("/nuevo-huesped");
  }

  inicializaReserva() {
    if (this.loader.isLoading) {
      this.loader.dismiss();
    }
    this.ready = false;
    this.sinPermisos = false;
    this.nombre = "-";
    this.email = "-";
    this.telefono = "-";
    this.idReserva = this.route.snapshot.paramMap.get('idReserva');
  }

  doRefresh(event) {
    this.ready = false;
    //Refrescar todos los datos de la reserva
    this.globalService.cargarDatos(this.globalService.cookies).then(() => {
      event.target.complete();

      //Filtramos las reservas por su id para obtener la reserva seleccionada
      let datosReservas = this.globalService.datosReservas.filter(datosReserva =>
        datosReserva.reserva.id.toString() == this.idReserva
      )
      //Puesto que nos devuelve una lista de un único elemento, lo sacamos de la lista y lo guardamos en una variable.
      this.datosReserva = datosReservas[0];
      this.ready = true;
    });
  }

  abrirHuesped(idHuesped){
    this.nav.navigateForward("/reserva/"+this.idReserva+"/huesped/"+idHuesped);
  }
}