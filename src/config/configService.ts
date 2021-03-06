import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {
  constructor() {}

  public config() {
    let urlPrefix = 'https://booking.becheckin.com/';
    // let urlPrefix = 'http://localhost:8080/';
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

  public configBooking() {
    let urlPrefix = 'https://hub-api.booking.com/';
    let urlAPI = 'v1.2/';
    return {
      restUrlPrefix: urlPrefix + urlAPI,
    };
  }
}
