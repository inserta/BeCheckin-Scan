import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FiltrosPage } from 'src/app/pages/filtros/filtros.page';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  constructor(
    private nav: NavController
  ) { }

  ngOnInit() {
  }

  cerrarSesion(){
    this.nav.navigateRoot("/login");
  }

}
