import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {
  constructor() {}

  public config() {
    let urlPrefix = 'https://booking.becheckin.com/';
    let urlAPI = '';
    return {
      restUrlPrefix: urlPrefix + urlAPI
    };
  }

  public configInsinno() {
    let urlPrefix = 'https://insinno.api.becheckin.es/';
    let urlAPI = 'api/v1/utils/';
    let urlAPIGuest = 'api/guest/v1';
    return {
      restUrlPrefix: urlPrefix + urlAPI,
      restUrlPrefixGuest: urlPrefix + urlAPIGuest
    };
  }
}
