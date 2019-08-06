import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {
  constructor() {}

  public config() {
    let urlPrefix = 'http://booking.becheckin.com/';
    let urlAPI = '';
    if (environment.production) {
      urlPrefix = '';
      urlAPI = '';
    }
    return {
      restUrlPrefix: urlPrefix + urlAPI
    };
  }
}
