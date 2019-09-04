import { Component, OnInit } from '@angular/core';
import { DatosReserva, FastCheckin } from 'src/app/models/data.model';
import { LoadingService } from 'src/app/services/loading.service';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/globalService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-huesped',
  templateUrl: './huesped.page.html',
  styleUrls: ['./huesped.page.scss'],
})
export class HuespedPage implements OnInit {

  idReserva: string;
  idHuesped: string;
  sinPermisos: boolean;

  huesped: FastCheckin;
  datosReserva: DatosReserva;

  ready: boolean;

  constructor(
    private loader: LoadingService,
    private nav: NavController,
    private globalService: GlobalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.inicializaHuesped();
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
        if (this.datosReserva) {
          this.rellenaDatosHuesped();
          this.ready = true;
          console.log("resultado", res);
          console.log("idReserva", this.idReserva);
          console.log("idReserva", this.datosReserva);
        } else {
          this.nav.navigateRoot("/app/home");
        }
      }
    });
  }

  inicializaHuesped() {
    if (this.loader.isLoading) {
      this.loader.dismiss();
    }
    this.ready = false;
    this.sinPermisos = false;
    this.idReserva = this.route.snapshot.paramMap.get('idReserva');
    this.idHuesped = this.route.snapshot.paramMap.get('idHuesped');
    this.huesped = new FastCheckin();
    this.huesped.name = "-";
    this.huesped.surnameOne = "-";
    this.huesped.birthday = "-";
    this.huesped.nationality = "-";
    this.huesped.province = "-";
    this.huesped.sex = "-";
    this.huesped.typeOfDocument = "-";
    this.huesped.dni = { identifier: "-" };
    this.huesped.passport = { identifier: "-" };
    this.huesped.date_exp = null;
    this.huesped.imagenes = [];
    this.huesped.email = "-";
    this.huesped.signature = "-";

  }

  rellenaDatosHuesped() {
    this.huesped = this.datosReserva.huespedes.filter(huesped => huesped._id == this.idHuesped)[0];
    console.log(this.huesped);
  }

}
