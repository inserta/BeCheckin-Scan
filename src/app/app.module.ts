import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { RestWS } from './services/restService';
import { ConfigService } from 'src/config/configService';
import { CookieService } from 'ngx-cookie-service';
import { LoadingService } from './services/loading.service';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Http } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleCloudVisionServiceProvider } from './providers/vision/google-cloud-vision-service'

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalService } from './services/globalService';
import { DataManagement } from './services/dataManagement';
import { CryptProvider } from './providers/crypt/crypt';
import { DateFormatPipe } from './pipes/dateFormat/dateFormatPipe';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ImageViewerComponent
  ],
  entryComponents: [ImageViewerComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestWS,
    LoadingService,
    DataManagement,
    GlobalService,
    ConfigService,
    CryptProvider,
    CookieService,
    GoogleCloudVisionServiceProvider,
    DateFormatPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
