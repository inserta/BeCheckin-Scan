import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { CookieService } from 'ngx-cookie-service';
import { Cookies } from 'src/app/models/data.model';
import { GlobalService } from 'src/app/services/globalService';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage implements OnInit {

  cookies: Cookies;
  fechaLimiteInicial: string;
  fechaLimiteFinal: string;

  constructor(
    private nav: NavController,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.cookies = JSON.parse(this.cookieService.get('directScanData'));
    this.fechaLimiteInicial = this.cookies.filtros.fechaInicial;
    this.fechaLimiteFinal = this.cookies.filtros.fechaFinal;
  }

  cambiaFecha(date){
    this.cookies.filtros.fechaInicial = this.fechaLimiteInicial;
    this.cookies.filtros.fechaFinal = this.fechaLimiteFinal;
    this.globalService.guardarCookies(this.cookies);
  }

  cerrarFiltros(){
    this.nav.navigateRoot('/app/home');
  }

  filtroFastcheckin(event){
    console.log(event);
  }
}
