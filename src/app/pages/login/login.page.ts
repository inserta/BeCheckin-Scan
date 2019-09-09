import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { DataManagement } from 'src/app/services/dataManagement';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from 'src/app/services/globalService';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Credenciales } from 'src/app/models/form.model';
import { Cookies, Filtro, Recepcionista } from 'src/app/models/data.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  onLoginForm: FormGroup;
  credenciales: Credenciales;

  constructor(
    private cookieService: CookieService,
    private translate: TranslateService,
    private dm: DataManagement,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    public loading: LoadingService,
    public alertCtrl: AlertController,
    private nav: NavController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.inicializaCredenciales();
    this.globalService.leerCookies().then(res => {
      if (res) {
        this.router.navigateByUrl("/app/home");
      }
    });
  }

  ionViewLoaded() {
    console.log("ionViewLoaded");
    // this.credenciales.usuario = 'javier@becheckin.com';
    // this.credenciales.clave = 'javier';
  }

  inicializaCredenciales() {
    this.credenciales = new Credenciales();
    this.onLoginForm = this.formBuilder.group({
      usuario: [null, Validators.compose([Validators.required])],
      clave: [null, Validators.compose([Validators.required])]
    });
  }

  eventHandler(event) {
    if (this.credenciales.usuario && this.credenciales.clave && event.keyCode == 13) {
      this.login();
    }
  }

  login() {
    let translation: string = this.translate.instant('LOGINADMIN.FALLO');
    this.loading.present();
    this.dm.login(this.credenciales).then(data => {
      setTimeout(() => {

        let hijos = data.hijos;
        let recepcionista = data.recepcionista[0];
        console.log(data);
        console.log(hijos);
        console.log(recepcionista);
        let cookies: Cookies = new Cookies();
        cookies.idRecepcionista = recepcionista._id;
        cookies.idHotel = recepcionista.hotel._id;
        cookies.idCliente = recepcionista.hotel.idCliente;
        cookies.filtros = new Filtro();
        cookies.filtros.buscador = "";
        cookies.filtros.fastcheckin = "todos";
        let fechaInicio = new Date();
        fechaInicio.setHours(0, 0, 0, 0);
        let fechaFinal = new Date();
        fechaFinal.setHours(0, 0, 0, 0);
        cookies.filtros.fechaFinal = fechaFinal.toISOString();
        cookies.filtros.fechaInicial = fechaInicio.toISOString();
        this.globalService.guardarCookies(cookies);
        console.log("Iniciando sesión con:");
        console.log("Usuario:" + this.credenciales.usuario);
        console.log("Clave:" + this.credenciales.clave);
        console.log("Data: ", data);
        this.loading.dismiss();
        if(recepcionista.bienvenida){
          //Cuando esté lista la parte de bienvenida, debemos cambiar la navegación siguiente:
          // this.nav.navigateRoot("/bienvenida");
          this.nav.navigateRoot("/app/home");
        } else {
          this.nav.navigateRoot("/app/home");
        }
        // this.globalService.cargarDatos(cookies).then(res => {
        //   if (res) {
        //     this.inicializaCredenciales();
        //     this.loading.dismiss();
        //     if (this.globalService.recepcionista.bienvenida) {
        //     } else {
        //       this.router.navigateByUrl("/app/home");
        //     }
        //   } else {
        //     this.alertCtrl
        //       .create({
        //         header: 'Error',
        //         message: translation,
        //         buttons: [
        //           {
        //             text: 'Ok',
        //             role: 'ok'
        //           }
        //         ]
        //       })
        //       .then(alertEl => {
        //         alertEl.present();
        //       });
        //     this.loading.dismiss();
        //   }
        // });

      }, 200);
    }).catch(error => {
      setTimeout(() => {
        this.alertCtrl
          .create({
            header: 'Error',
            message: translation,
            buttons: [
              {
                text: 'Ok',
                role: 'ok'
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
        this.credenciales.clave = '';
        this.credenciales.usuario = '';
        this.loading.dismiss();
      }, 500);
    });
  }

}
