import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private translateService: TranslateService,
    private cookieService: CookieService,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log(window.navigator.language);

      this.translateService.setDefaultLang('en');
      if (this.cookieService.check('langRecepApp')) {
        let language = this.cookieService.get('langRecepApp');
        this.translateService.use(language);
      } else {
        if(window.navigator.language){
          if( window.navigator.language=='es-ES' || window.navigator.language=='es-US' ){
            this.translateService.use('es');
            this.cookieService.set('langRecepApp', 'es');
          } else {
            this.translateService.use('en');
            this.cookieService.set('langRecepApp', 'en');
          }
        } else {
          this.translateService.use('en');
          this.cookieService.set('langRecepApp', 'en');
        }
      }
    });
  }
}
