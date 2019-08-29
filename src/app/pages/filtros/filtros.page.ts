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
  copiaCookies: Cookies;
  fechaLimiteInicial: string;
  fechaLimiteFinal: string;
  fastcheckin: string;

  constructor(
    private nav: NavController,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.cookies = JSON.parse(this.cookieService.get('directScanData'));
    this.copiaCookies = JSON.parse(this.cookieService.get('directScanData'));
    this.fechaLimiteInicial = this.cookies.filtros.fechaInicial;
    this.fechaLimiteFinal = this.cookies.filtros.fechaFinal;
    this.fastcheckin = this.cookies.filtros.fastcheckin;
  }

  cambiaFecha(date) {
    this.cookies.filtros.fechaInicial = this.fechaLimiteInicial;
    this.cookies.filtros.fechaFinal = this.fechaLimiteFinal;
    this.globalService.guardarCookies(this.cookies);
  }

  cerrarFiltros() {
    
    //Si se han realizado cambios, se fuerza la carga de las nuevas reservas.
    if (this.compruebaCambios()) {
      this.nav.navigateRoot('/app/home?cargarDatos=true');
    } else {
      //En caso contrario, volvemos a la página de reservas anterior sin cargar nuevas reservas.
      this.nav.navigateRoot('/app/home');
    }
  }

  filtroFastcheckin(event) {
    this.cookies.filtros.fastcheckin = this.fastcheckin;
    this.globalService.guardarCookies(this.cookies);
  }

  compruebaCambios() {
    let res = false;
    if (this.cookies.filtros.fastcheckin != this.copiaCookies.filtros.fastcheckin ||
      this.cookies.filtros.fechaInicial != this.copiaCookies.filtros.fechaInicial ||
      this.cookies.filtros.fechaFinal != this.copiaCookies.filtros.fechaFinal) {
      res = true;
    }
    return res;
  }
}
