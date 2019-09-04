import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    isLoading = false;

    constructor(
        public loadingController: LoadingController,
        private translate: TranslateService
    ) { }

    async present(message?) {
        let translation: string = "";
        if(message){
            translation = message;
        } else {
            translation = this.translate.instant('CARGANDO.ESPERE');
        }
        this.isLoading = true;
        return await this.loadingController.create({
            message: translation,
            showBackdrop: true,
            duration: 20000,
        }).then(a => {
            a.present().then(() => {
                if (!this.isLoading) {
                    a.dismiss().then();
                }
            });
        });
    }

    async dismiss() {
        this.isLoading = false;
        return await this.loadingController.dismiss().then();
    }
}