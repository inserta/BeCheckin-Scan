import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';

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
    this.nav.navigateRoot('/app/home');
  }

  filtroFastcheckin(event){
    console.log(event);
  }
}
