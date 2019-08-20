import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {
  constructor() {}

  public config() {
    let urlPrefix = 'http://booking.becheckin.com/';
    let urlAPI = '';
    return {
      restUrlPrefix: urlPrefix + urlAPI
    };
  }

  public configInsinno() {
    let urlPrefix = 'https://insinno.api.becheckin.es/';
    let urlAPI = 'api/v1/utils/';
    return {
      restUrlPrefix: urlPrefix + urlAPI
    };
  }
}
