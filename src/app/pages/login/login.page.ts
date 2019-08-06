import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { DataManagement } from 'src/app/services/dataManagement';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from 'src/app/services/globalService';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Credenciales } from 'src/app/models/form.model';

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
    private router: Router,
  ) { }

  ngOnInit() {
    this.credenciales = new Credenciales();
    this.onLoginForm = this.formBuilder.group({
      usuario: [null, Validators.compose([Validators.required])],
      clave: [null, Validators.compose([Validators.required])]
    });
    this.inicializaCredenciales();
  }

  ionViewLoaded() {
    // this.credenciales.usuario = 'javier@becheckin.com';
    // this.credenciales.clave = 'javier';
  }

  inicializaCredenciales() {
    // this.credenciales.usuario = 'javier@becheckin.com';
    // this.credenciales.clave = 'javier';
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
        this.cookieService.set('tokenCliente', data.cliente[0]._id);
        console.log("Iniciando sesión con:");
        console.log("Usuario:" + this.credenciales.usuario);
        console.log("Clave:" + this.credenciales.clave);
        console.log(data.recepcionista[0]);
        this.globalService.recepcionista = data.recepcionista[0];
        this.credenciales.clave = '';
        this.credenciales.usuario = '';
        this.loading.dismiss();
        this.router.navigateByUrl("dashboard");
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
