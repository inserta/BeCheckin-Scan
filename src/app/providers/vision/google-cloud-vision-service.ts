import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ 
    providedIn: 'root', 
})
export class GoogleCloudVisionServiceProvider {

    constructor(public httpClient: HttpClient) { }

    getLabels(base64Image) {
        const body = {
            "requests": [
                {
                    "image": {
                        "content": base64Image
                    },
                    "features": [
                        {
                            "type": "DOCUMENT_TEXT_DETECTION"
                        }
                    ]
                }
            ]
        }

        return this.httpClient.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body);
    }

}