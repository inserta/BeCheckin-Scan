import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage implements OnInit {

  constructor(
    private nav: NavController
  ) { }

  ngOnInit() {
  }

  cerrarFiltros(){
    this.nav.navigateForward('/app/home');
  }

}
