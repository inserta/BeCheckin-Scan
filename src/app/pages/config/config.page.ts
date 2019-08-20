import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FiltrosPage } from 'src/app/pages/filtros/filtros.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  constructor(
    private nav: NavController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  cerrarSesion(){
    // this.nav.navigateRoot("/login");
    this.router.navigateByUrl("/login");
  }

}
