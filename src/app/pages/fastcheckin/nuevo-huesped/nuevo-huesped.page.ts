import { FastCheckin, Guest } from '../../../models/data.model';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
// import { IonicPage, Content, Loading, NavController, NavParams, Toast, Events, ModalController, ViewController, Platform } from 'ionic-angular';
import { User } from '../../../models/data.model';
import { CryptProvider } from '../../../providers/crypt/crypt';
// import { ServiceAPI } from "../../../services/service.api";
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { TranslateService } from '@ngx-translate/core';
// import { ApiComponents } from '../../components/api-components'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { StorageService } from '../../app/services/service.storage';
import { AlertController, NavController } from '@ionic/angular';
// import { AuthProvider } from '../../providers/auth/auth';
import { GoogleCloudVisionServiceProvider } from '../../../providers/vision/google-cloud-vision-service';
// import { DNIValidator } from '../../validators/dni';
// import { ImageViewerController } from "ionic-img-viewer";

// let moment = require('moment');
// import moment from 'moment';
import { GlobalService } from '../../../services/globalService';
import { ErroresFormularioRegistro, PasoAnterior } from '../../../models/others.model';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DataManagement } from 'src/app/services/dataManagement';

@Component({
  selector: 'app-nuevo-huesped',
  templateUrl: './nuevo-huesped.page.html',
  styleUrls: ['./nuevo-huesped.page.scss'],
})
export class NuevoHuespedPage implements OnInit {

  users: any[];
  private signature: string;
  private typeDocument: string = 'D';  //Tipo documento DNI,  P para pasaporte
  private idReserva: string = '';

  public dataUpdate: boolean = false;
  private loginForm: FormGroup;
  private user: User;
  private sex: string = 'F';
  private keys: any[];
  private keysRooms: any[];
  private email: string;
  private password: string;
  private name: string;
  private code: string;
  private first: boolean = true;
  private salida: boolean = false;
  private conditions: boolean = false;
  private policysecurity: boolean = false;
  private condiciones_hotel: any = "";

  public photosNif: any;
  public photosPassport: any;
  public photosNifSubida: any;
  public photosPassportSubida: any;
  public linksSubidos: any;
  public id_img: any;

  image: string = '';
  filestring: string = '';
  files: FileList;
  bookingData: any;
  newGuest: boolean = false;
  clienteActual: any;
  hotel: any;
  existFastcheckin: boolean = false;
  fastcheckinSuccess: boolean = false;
  existSignature: boolean = false;
  emailfield: string = '';
  imagen_dni: any;

  sinPermisos: boolean = false;

  @ViewChild('sigpad', { static: false }) sigpad: SignaturePad;
  @ViewChild('canvas', { static: false }) canvasElement: ElementRef;

  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 300,
    'canvasHeight': 160,
    'backgroundColor': '#f6fbff',
    'penColor': '#666a73',
    'dotSize': 1
  };


  public isDrawing = false;

  hotel_id: any;
  hotel_name: any;
  selected_filter = [];

  textofast: string;

  //Nuevos atributos

  tipoDoc: string = "dni";
  paso: number = 1;
  pasosAnteriores: PasoAnterior[] = [];
  progreso: string = "0\%";
  errorScan: number = 0;
  fastcheckin: FastCheckin;
  erroresRegistroManual: ErroresFormularioRegistro;
  tiposDocumentos = {
    opciones: [
      { id: 'D', name: this.translate.instant("HUESPED.REGISTRO_MANUAL.DNI") },
      { id: 'P', name: this.translate.instant("HUESPED.REGISTRO_MANUAL.PASAPORTE") }
    ]
  };
  tiposSexo = {
    opciones: [
      { id: 'M', name: this.translate.instant("HUESPED.REGISTRO_MANUAL.HOMBRE") },
      { id: 'F', name: this.translate.instant("HUESPED.REGISTRO_MANUAL.MUJER") }
    ]
  };

  constructor(
    public navCtrl: NavController,
    // public navParams: NavParams,
    // public viewCtrl: ViewController,
    // public api: ServiceAPI,
    private globalService: GlobalService,
    // private platform: Platform,
    private translate: TranslateService,
    // private apiComponents: ApiComponents,
    // private storageService: StorageService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    // private serviceAPI: ServiceAPI,
    // private authProvider: AuthProvider,
    // private events: Events,
    // private service: ServiceAPI,
    // private modalCtrl: ModalController,
    private vision: GoogleCloudVisionServiceProvider,
    private cryptProvider: CryptProvider,
    // public imageViewerCtrl: ImageViewerController,
    private router: Router,
    private loader: LoadingService,
    private dm: DataManagement
  ) {

  }

  ngOnInit() {
    //Inicializamos todos los campos a vacío del usuario
    this.user = new User();
    this.user.guest = new Guest();
    this.user.guest.fastcheckin = new FastCheckin();
    this.user.guest.fastcheckin.imagenes = [];
    this.user.guest.fastcheckin.dni = { identifier: '' };
    this.user.guest.fastcheckin.passport = { identifier: '' };


    this.hotel = this.globalService.hotel;

    // Inicializamos los arrays que contendrán las imagenes en B64 para mostrar:
    this.photosNif = [];
    this.photosPassport = [];

    // Inicializamos los arrays que contendrán las imagenes tal y como vienen para enviar:
    this.photosNifSubida = [];
    this.photosPassportSubida = [];
  }

  filtro() {
    return this.users.filter((user) => {
      return user.fastcheckin != null;
    })
  }

  close() {
    this.navCtrl.navigateBack("/app/home");
    // this.router.navigateByUrl("/reserva/"+this.idReserva);
  }

  signatureData(data) {
    this.signature = data;
  }

  drawComplete() {
    this.isDrawing = false;
  }

  drawStart() {
    this.isDrawing = true;
    this.existSignature = true;
  }

  savePad() {
    this.signature = this.sigpad.toDataURL();
    this.user.guest.fastcheckin.signature = this.signature;
    this.user.guest.fastcheckin.email = this.email;
    console.log('Firma: ', this.signature)
  }

  clearPad() {
    this.sigpad.clear();
    this.signature = "";
    this.existSignature = false;
  }

  alerta(titulo, mensaje) {

    this.alertCtrl
      .create({
        header: titulo,
        message: mensaje,
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
  }

  saveProfilemio() {
    let promises = [];
    let contador_subida_dni = 0;
    this.linksSubidos = [];

    // PARA SELECCIÓN DE DNI:
    if (this.typeDocument == 'D') {

      // SUBIDA PARTE TRASERA DNI:

      this.globalService.subirArchivo(this.photosNifSubida[0], 'huespedes/' + this.user.guest._id, 'dni_trasero')
        .then(ok => {
          console.log('Subido trasero con éxito DNI');
          this.linksSubidos.push({ enlace: 'huespedes/' + this.user.guest._id, nombre: 'dni_trasero' + this.getExtension(this.photosNifSubida[0]) });


          // SUBIDA PARTE FRONTAL DNI:
          this.globalService.subirArchivo(this.photosNifSubida[1], 'huespedes/' + this.user.guest._id, 'dni_frontal')
            .then(ok => {
              console.log('Subido trasera con éxito DNI');
              this.linksSubidos.push({ enlace: 'huespedes/' + this.user.guest._id, nombre: 'dni_frontal' + this.getExtension(this.photosNifSubida[1]) });
              this.sendProfile();
            }).catch((error) => {
              this.loader.dismiss();
              console.log('Error subida trasera DNI');
            });
        }).catch((error) => {
          this.loader.dismiss();
          console.log('Error Subida frontal DNI');
          contador_subida_dni++;
        });

    } else {

      // SUBIDA PASAPORTE:
      this.globalService.subirArchivo(this.photosPassportSubida[0], 'huespedes/' + this.user.guest._id, 'pasaporte')
        .then(ok => {
          console.log('Subido Pasaporte con éxito');
          this.linksSubidos.push({ enlace: 'huespedes/' + this.user.guest._id, nombre: 'pasaporte' + this.getExtension(this.photosPassportSubida[0]) });
          this.sendProfile();
        }).catch((error) => {
          this.loader.dismiss();
          console.log('Error subida pasaporte');
          //this.sendProfile();
        });
    }


  }


  // Devuelve la extensión del fichero binario de una imagen:
  getExtension(fichero) {
    let regex = /(?:\.([^.]+))?$/;
    let extension = regex.exec(fichero.name);
    return extension[0];
  }

  comprobardatos() {
    this.existFastcheckin = false;
    this.fastcheckinSuccess = false;
    //TODO: Seguir fastcheckin por aquí. Guest undefined...
    // this.user.guest.fastcheckin.caducate = this.user.keysRooms[0].start;
    this.user.guest.fastcheckin.typeOfDocument = this.typeDocument;
    // this.user.guest.fastcheckin._id = this.user.guest._id;
    // this.user.guest.fastcheckin.reserve = this.user.keysRooms[0].downloadCode;
    // this.user.guest.fastcheckin.email = this.email;
    // this.user.guest.email = this.email;
    //this.savePad();
    if (this.user.guest.fastcheckin && this.user.guest.fastcheckin.typeOfDocument == 'P') {

      if (this.user.guest.fastcheckin
        && this.user.guest.fastcheckin.birthday != ""
        // && this.user.guest.fastcheckin.caducate != null
        && this.user.guest.fastcheckin.name != ""
        && this.user.guest.fastcheckin.surnameOne != ""
        && this.user.guest.fastcheckin.sex != ""
        && (this.user.guest.fastcheckin.passport.identifier != "")
      ) {
        this.existFastcheckin = true;
        this.fastcheckinSuccess = true;
        if (this.paso != 3) {
          let pasoAnterior = new PasoAnterior();
          pasoAnterior.paso = this.paso;
          pasoAnterior.progreso = this.progreso;
          this.pasosAnteriores.push(pasoAnterior);
          this.paso = 3
          this.progreso = "33\%";
        }
      } else {
        // Llamamos a confirmación de imágenes en caso de error:
        this.existFastcheckin = true;
        this.fastcheckinSuccess = false;
        if (this.paso != 3) {
          let pasoAnterior = new PasoAnterior();
          pasoAnterior.paso = this.paso;
          pasoAnterior.progreso = this.progreso;
          this.pasosAnteriores.push(pasoAnterior);
          this.paso = 3
          this.progreso = "33\%";
        }
      }
    } else {
      if (this.user.guest.fastcheckin
        && this.user.guest.fastcheckin.birthday != ""
        // && this.user.guest.fastcheckin.caducate != null
        && this.user.guest.fastcheckin.date_exp != null
        && this.user.guest.fastcheckin.name != ""
        && this.user.guest.fastcheckin.surnameOne != ""
        && this.user.guest.fastcheckin.nationality != ""
        && this.user.guest.fastcheckin.sex != ""
        && this.user.guest.fastcheckin.typeOfDocument != ""
        && (this.user.guest.fastcheckin.dni.identifier != "" || this.user.guest.fastcheckin.passport.identifier != "")
      ) {
        this.existFastcheckin = true;
        this.fastcheckinSuccess = true;

        if (this.id_img === 1) {
          if (this.paso != 3) {
            let pasoAnterior = new PasoAnterior();
            pasoAnterior.paso = this.paso;
            pasoAnterior.progreso = this.progreso;
            this.pasosAnteriores.push(pasoAnterior);
            this.paso = 3;
            this.progreso = "50\%";
          }
        } else if (this.id_img === 2) {
          if (this.paso != 3) {
            let pasoAnterior = new PasoAnterior();
            pasoAnterior.paso = this.paso;
            pasoAnterior.progreso = this.progreso;
            this.pasosAnteriores.push(pasoAnterior);
            this.paso = 2;
            this.progreso = "25\%";
          }
        }
      } else {

        // Llamamos a confirmación de imágenes en caso de error:
        this.existFastcheckin = true;
        this.fastcheckinSuccess = false;
        if (this.id_img === 1) {
          if (this.paso != 3) {
            let pasoAnterior = new PasoAnterior();
            pasoAnterior.paso = this.paso;
            pasoAnterior.progreso = this.progreso;
            this.pasosAnteriores.push(pasoAnterior);
            this.paso = 3;
            this.progreso = "50\%";
          }
        } else if (this.id_img === 2) {
          if (this.paso != 3) {
            let pasoAnterior = new PasoAnterior();
            pasoAnterior.paso = this.paso;
            pasoAnterior.progreso = this.progreso;
            this.pasosAnteriores.push(pasoAnterior);
            this.paso = 2;
            this.progreso = "25\%";
          }
        }
      }
    }
  }

  saveProfile() {
    this.loader.present();
    if (this.existFastcheckin) {
      // No tiene condiciones hotel:
      if (this.condiciones_hotel.length == 0) {
        if (this.policysecurity) {
          this.savePad();
          this.user.guest.fastcheckin.email = this.email;
          this.user.guest.email = this.email;
          //this.user.email = this.email;
          console.log("User: ", this.user.guest)
          if (!this.existSignature) {
            this.loader.dismiss();
            this.alerta("FASTCHECKIN", this.translate.instant("FASTCHECKIN.NOSIGNATURE"));
          } else {
            this.saveProfilemio();
          }

        }
        else {
          this.loader.dismiss();
          this.alerta(this.translate.instant("POLICY.TITLECONDITIONS"), this.translate.instant("POLICY.CONDITIONSP"));
        }
      }
      else {
        if (this.conditions && this.policysecurity) {
          this.savePad();
          console.log("User: ", this.user.guest)
          if (!this.existSignature) {
            this.loader.dismiss();
            this.alerta('FASTCHECKIN', this.translate.instant("FASTCHECKIN.NOSIGNATURE"));
          } else {
            this.saveProfilemio();
          }

        }
        else {
          this.loader.dismiss();
          this.alerta(this.translate.instant("POLICY.TITLECONDITIONS"), this.translate.instant("POLICY.CONDITIONS"));
        }
      }
    }
    else {
      this.loader.dismiss();
      this.alerta('FASTCHECKIN', this.translate.instant("FASTCHECKIN.NOFOTO"));
    }
  }

  private checkKeyPermisions() {
    //if (this.salida) {
    //  this.navCtrl.setRoot('KeysPage', { animate: true, direction: 'backward' });
    //}else{
    //let existe = 0;
    let idGuest = this.user.guest._id
    for (let keyRoom of this.user.guest.keysRooms) {
      if (this.user.guest.clientOf.some(x => x === keyRoom.client._id)) {
        console.log("Existe key permiso");
        //existe = 1;
        //this.close();
        //this.anotherGuest();

      }
      else {
        this.user.guest.clientOf.push(keyRoom.client._id);
        this.dm.setPermissionPersonalData(idGuest, keyRoom.client._id, keyRoom.client.name, "yes")
          .then((response) => {
            //this.close();
            //this.anotherGuest();
            console.log("SetPermissionPersonalData:", response);
          }).catch((error) => {
            console.log(error);
          });
      }
    }
    this.paso = 5;
    this.progreso = "100\%";
    //this.anotherGuest();
    //}
  }

  analyze(image) {

    console.log('analizando...');
    console.log("imagen destino a guardar: " + this.id_img);

    // Volcamos la imagen en el campo correcto:
    // switch (this.id_img) {
    //   case 1:
    //     this.photosNif[0] = "data:image/jpeg;base64," + image;
    //     break;
    //   case 2:
    //     this.photosNif[1] = "data:image/jpeg;base64," + image;
    //     break;
    //   case 3:
    //     this.photosPassport[0] = "data:image/jpeg;base64," + image;
    // }

    try {
      this.loader.present();
      /*
      loading.onDidDismiss(() => {
          let titleAlert = this.translate.instant("FASTCHECKIN.ADVICE_BEFORE_ANALIZE_TITLE");
          let textAlert = this.translate.instant("FASTCHECKIN.ADVICE_BEFORE_ANALIZE_TEXT");
 
          let alert = this.alertCtrl.create({
              title: titleAlert,
              subTitle: textAlert,
              buttons: ['OK']
          });
          alert.present();
 
      });*/

      try {
        this.vision.getLabels(image).subscribe((result: any) => {
          console.log(result);
          let res = result.responses[0].fullTextAnnotation;
          if (res) {
            //this.typeDocument = res.responses[0].fullTextAnnotation.text.indexOf('passport') >= 0 || res.responses[0].fullTextAnnotation.text.indexOf('PASSPORT') >= 0 ? 'P' : 'D';

            if (this.tipoDoc == 'dni') {
              console.log('dni')
              this.typeDocument = 'D';
              this.recognizeDNIText(res.text);
            } else {
              this.typeDocument = 'P';
              this.loader.dismiss();
              //this.activarFormularioManual();
              this.recognizePassportText(res.text);
            }
          } else {
            this.loader.dismiss()
            this.errorScan = this.errorScan + 1;
            if (this.errorScan >= 2) {
              this.activarFormularioManual();
            } else {
              this.alerta(this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TITULO"), this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TEXTO"));
            }
          }
        }, err => {
          this.loader.dismiss();
          console.log(err);
          this.errorScan = this.errorScan + 1;
          if (this.errorScan >= 2) {
            this.activarFormularioManual();
          } else {
            this.alerta(this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TITULO"), this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TEXTO"));
          }
        });
      } catch (error) {
        console.log(error);
        //this.showToast("FASTCHECKIN.NO_SCANNER");
        this.errorScan = this.errorScan + 1;
        if (this.errorScan >= 2) {
          this.activarFormularioManual();
        } else {
          this.alerta(this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TITULO"), this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TEXTO"));
        }
      }
    } catch (error) {
      console.log(error);
      this.errorScan = this.errorScan + 1;
      if (this.errorScan >= 2) {
        this.activarFormularioManual();
      } else {
        this.alerta(this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TITULO"), this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TEXTO"));
      }
    }
  }

  private sendProfile() {
    console.log(this.user);

    // Introducimos las imagenes en la estructura de FastCheckin:
    this.user.guest.fastcheckin.imagenes = this.linksSubidos;

    let fastcheckin = this.cryptProvider.encryptData(this.user);
    // this.serviceAPI.setFastcheckin(this.user, fastcheckin.toString())
    //   .then((response) => {
    //     this.serviceAPI.actualGuests.push(this.user.guest);
    //     this.user.guest.fastcheckin = CryptProvider.decryptData(fastcheckin.toString(), this.user.guest._id);
    //     console.log('Fast: ', this.user.guest.fastcheckin);
    //     var fechaInicio = new Date(this.user.guest.fastcheckin.birthday).getTime();
    //     var fechaFin = new Date().getTime();

    //     var diff = fechaFin - fechaInicio;

    //     var edad = diff / (1000 * 60 * 60 * 24 * 365)

    //     console.log(diff / (1000 * 60 * 60 * 24 * 365));
    //     this.serviceAPI.actualUser.edad = edad
    //     this.storageService.setUserData(this.user);
    //     this.events.publish('setUser', this.user);
    //     this.dataUpdate = true;
    //     this.serviceAPI.getHotel(this.user.keysRooms[0].client._id).then(hotel => {
    //       console.log('h: ', hotel)
    //       let mail = this.user.keysRooms[0].client.email;

    //       if ((hotel[0].email) && (hotel[0].email != hotel[0].user) && (hotel[0].email != '')) {
    //         mail = mail + ', ' + hotel[0].email;
    //         if (hotel[0].activo == '0')
    //           mail = hotel[0].email;
    //       }

    //       console.log('email to: ', mail)

    //       let asunto = "Nuevo Fastcheckin";
    //       let mailTo = mail;
    //       let cco = "amalia@becheckin.com, lidia@becheckin.com";
    //       let nombreHuesped=this.user.keysRooms[0].client.name;
    //       let nombreReserva=this.user.keysRooms[0].downloadCode;
    //       let fechaInicio=this.user.keysRooms[0].start.substring(0, 10);
    //       let fechaFin=this.user.keysRooms[0].finish.substring(0, 10);
    //       let fastcheckin: FastCheckin = this.user.guest.fastcheckin;
    //       let mensaje = "<!doctype html><html><head><title>Becheckin<\/title><style>.cuerpo{margin: 2%;background: #003581;border-radius: 10px;border: 2px solid #444;box-shadow: 0px 0px 10px 4px #888888;color:#E5E5E5;padding: 1%;}.imagen{margin-top: 10px;margin-bottom: 5px;display: flex;justify-content: center;align-items: center;}img{margin: 0 auto; border-radius: 5px;overflow: hidden;}.bienvenida{margin-left: 3%;margin-right: 3%;font-size: 20px;font-weight: bold;}.nombre{color: #f9ffac;}.reserva{font-weight: bold;color: #ecffbf;}.texto{margin-top: 20px;margin-left: 6%;margin-right: 6%;font-size: 18px;}.fecha1{color: #c4ffb5;}.fecha2{color: #ffb5b5;}.info{margin-bottom: 10px;}.fechas{margin-bottom: 10px;}.datos{margin-bottom: 10px;}.dato{font-size: 14px;margin: 5px 2%;}.texto_final{margin-bottom: 30px;font-size: 14px;font-style: italic;}a{color: #feffce;}.pie{text-align: center;font-style: italic;color: #7e7e7e;}<\/style><\/head><body><div class='cuerpo'><div class='imagen'><img src='https:\/\/dashboard.becheckin.com\/imgs\/logo\/inserta.png' width='50' height='50' \/><\/div><div class='bienvenida'>Hola <span class='nombre'>"+(nombreHuesped?nombreHuesped : "")+"<\/span><\/div><div class='texto'><div class='info'>Tu reserva <span class='reserva'>"+(nombreReserva?nombreReserva : "")+"<\/span> tiene un nuevo FastCheckin.<\/div><div class='fechas'>Entrada <span class='fecha1'>"+(fechaInicio?fechaInicio : "")+"<\/span> | Salida <span class='fecha2'>"+(fechaFin?fechaFin : "")+"<\/span><\/div><div class='datos'>Datos huésped:<div class='dato'>Nombre: "+(fastcheckin.name?fastcheckin.name : "")+"<\/div><div class='dato'>Apellidos: "+(fastcheckin.surnameOne?fastcheckin.surnameOne : "")+"<\/div><div class='dato'>Fecha Nacimiento: "+(fastcheckin.birthday?fastcheckin.birthday : "")+"<\/div><div class='dato'>Fecha Expedicion: "+(fastcheckin.date_exp?fastcheckin.date_exp : "")+"<\/div><div class='dato'>Dni: "+(fastcheckin.dni.identifier?fastcheckin.dni.identifier : "")+"<\/div><div class='dato'>Pasaporte: "+(fastcheckin.passport.identifier?fastcheckin.passport.identifier : "")+"<\/div><div class='dato'>Nacionalidad: "+(fastcheckin.nationality?fastcheckin.nationality : "" )+"<\/div><div class='dato'>Sexo: "+(fastcheckin.sex?fastcheckin.sex : "" )+"<\/div><div class='dato'>Email: "+(fastcheckin.email?fastcheckin.email : "" )+"<\/div><\/div><div class='texto_final'>Puedes consultar los datos FastCheckin en tu dashboard: <a href='https:\/\/dashboard.becheckin.com'target='_blank' style='color:#feffce;'>https:\/\/dashboard.becheckin.com <\/a><br \/>Nos tienes siempre a tu disposición en Booking@becheckin.com y en el teléfono +34 627 07 41 73.<\/div><\/div><\/div><\/body><footer><hr \/><div class='pie'>Atentamente, BeCheckin Team.<\/div><\/footer><\/html>";
    //       this.dm.sendGenericMail(asunto, mensaje, mailTo, "", cco).then(res => {
    //         console.log(res);
    //         this.loader.dismiss();
    //         this.checkKeyPermisions();
    //       });
    //     })

    //   });
  }

  private recognizePassportText(text: any) {



    let texts = text.split('\n');
    let promises = [];
    promises.push(this.recognizeOtherData(texts[texts.length - 2]));
    promises.push(this.recognizeNamePassport(texts[texts.length - 3]));

    Promise.all(promises)
      .then(() => {
        this.loader.dismiss();
        this.comprobardatos();
      }).catch(() => {
        this.loader.dismiss();
        this.comprobardatos();
        /*
        this.errorScan = this.errorScan + 1;
        if (this.errorScan >= 2) {
          this.activarFormularioManual();
        } else {
          let alert = this.alertCtrl.create({
            title: this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TITULO"),
            subTitle: this.translate.instant("HUESPED.ERROR_RECO_IMAGEN_TEXTO"),
            buttons: ['OK']
          });
          alert.present();
        }*/
      });
  }

  private recognizeDNIText(text: any) {

    let tipoDocumento = "";

    console.log('text DNI: ', text)
    let texts = text.split('\n');
    console.log('text ', texts)
    let promises = [];
    let ID = '';
    let NIE = '';
    let indice = 0;
    let cont = 0;
    console.log('Id: ', ID)

    for (let texto of texts) {
      console.log(texto);
      ID = texto.replace(/\s/g, "").substring(0, 2);
      NIE = texto.replace(/\s/g, "").substring(0, 3);
      if (ID == 'ID') {
        tipoDocumento = "dni";
        indice = texts.indexOf(texto);
        console.log(indice);
        break;
      } else if (NIE.toLowerCase().includes("nie")) {
        tipoDocumento = "nie";
        indice = texts.indexOf(texto);
        console.log(indice);
        break;
      } else {
        console.log("Nada encontrado por el momento");
      }
    }

    //FGV
    if (tipoDocumento == "dni") {

      promises.push(this.recognizeDNI(texts[indice].replace(/ /g, "")));
      promises.push(this.recognizeDatesAndSex(texts[indice + 1].replace(/ /g, "")));
      promises.push(this.recognizeName(texts[indice + 2]));
      promises.push(this.recognizeNationality(texts[indice + 1].replace(/ /g, "")));

      Promise.all(promises)
        .then(() => {

          this.loader.dismiss();
          this.comprobardatos();

        }).catch((error) => {
          console.log(error)
          this.loader.dismiss();
          this.comprobardatos();
        });
    } else {
      this.loader.dismiss();
      this.comprobardatos();
    }
  }

  private recognizeDNI(lineDNI) {
    return new Promise<string>((resolve, reject) => {
      lineDNI = lineDNI.replace(/ /g, "");
      let foundLower: boolean = false;
      let isNotFirstCharacter: boolean = true;
      let lengthDNI = 9;
      let dni = "";
      for (var index = Number(lineDNI.length) - 1; index > 0; index--) {
        if (lineDNI[index] == '<') {
          foundLower = true;
        } else if (foundLower) {
          if (lengthDNI != 0) {
            let character = lineDNI[index];
            if (!isNotFirstCharacter) {
              character = character == 'O' || character == 'o' ? 0 : character;
            }
            isNotFirstCharacter = false;
            dni = character + dni;
            lengthDNI--;
          }
        }
      }

      //this.loginForm.patchValue({ document: dni });
      this.user.guest.fastcheckin.dni.identifier = dni;
      //this.typeDocument = 'D';


      resolve();
    });
  }

  private recognizeName(lineName) {
    return new Promise<string>((resolve, reject) => {
      lineName = lineName.replace(/~/g, '');
      let lineNamesSurname = lineName.split('<<');
      let surname = lineNamesSurname[0].replace(/</g, " ");
      let name = lineNamesSurname[1].replace(/</g, " ");

      //this.loginForm.patchValue({ name: name });
      //this.loginForm.patchValue({ lastname: surname });
      this.user.guest.fastcheckin.name = name;
      this.user.guest.fastcheckin.surnameOne = surname;

      resolve();
    });
  }

  private recognizeNamePassport(lineName) {
    return new Promise<string>((resolve, reject) => {
      lineName = lineName.substring(5, lineName.length);
      let index = lineName.length - 1;
      while (index >= 0) {
        if (lineName[index] != '<') {
          lineName = lineName.substring(0, index + 1);
          break;
        }
        index--;
      }

      let lineNamesSurname = lineName.split('<<');
      let surname = lineNamesSurname[0].replace(/</g, " ");
      let name = lineNamesSurname[1].replace(/</g, " ");

      //this.typeDocument = 'P';
      this.user.guest.fastcheckin.name = name;
      this.user.guest.fastcheckin.surnameOne = surname;

      // this.loginForm.patchValue({ name: name });
      // this.loginForm.patchValue({ lastname: surname });
      resolve();
    });
  }

  private calculateYear(date, date1) {
    let birth = new Date(date1);
    // var diff = moment.duration(moment(birth).diff(moment(date)));
    // var years = diff.asDays() / 365;
    // years = years * -1;
    return 1990;
  }

  private recognizeDatesAndSex(lineName) {
    let expeditionYearText = null;
    let years;
    let cases = [2, 5, 10];
    //this.alerta('DateSex', lineName);

    return new Promise<string>((resolve, reject) => {

      let sex = lineName.substring(7, 8);
      this.sex = sex;
      this.user.guest.fastcheckin.sex = sex;
      //this.alerta('Sex', this.sex);
      let year = '19';

      let birthdateYearText = lineName.substring(0, 2);
      let birthdateMonthText = lineName.substring(2, 4);
      let birthdateDayText = lineName.substring(4, 6);

      if (birthdateYearText + 1 < 30) year = '20';
      let birthdateText = year + birthdateYearText + "-" + birthdateMonthText + "-" + birthdateDayText;
      //this.loginForm.patchValue({ birthday: birthdateText });
      this.user.guest.fastcheckin.birthday = birthdateText;


      let caducateYearText = lineName.substring(8, 10);
      let caducateMonthText = lineName.substring(10, 12);
      let caducateDayText = lineName.substring(12, 14);
      let caducateText = "20" + caducateYearText + "-" + caducateMonthText + "-" + caducateDayText;
      //this.alerta('Caducate ',  caducateText);
      //this.loginForm.patchValue({ caducate: caducateText });


      cases.forEach((element) => {
        let caducateYearText1 = caducateYearText - element;
        let caducateAux = "20" + caducateYearText1 + "-" + caducateMonthText + "-" + caducateDayText;
        let dateCaducate = new Date(caducateAux);
        let year = this.calculateYear(dateCaducate, birthdateText);
        if (element == 5 && year < 30 && expeditionYearText == null) {
          expeditionYearText = caducateYearText - 5;
        } else if (element == 2 && year < 5 && expeditionYearText == null) {
          expeditionYearText = caducateYearText - 2;
        } else if (element == 10 && year < 70 && expeditionYearText == null) {
          expeditionYearText = caducateYearText - 10;
        }
      });

      let ok = true;

      let m = parseInt(caducateMonthText, 10)
      if (m)
        if (m < 13)
          console.log('ok: ', m)
        else {
          console.log('no ok:', m)
          ok = false;
        }
      else {
        console.log('bad: ', m)
        ok = false;
      }

      let d = parseInt(caducateDayText, 10)
      if (d)
        if (d < 31)
          console.log('ok: ', d)
        else {
          console.log('no ok:', d)
          ok = false;
        }
      else {
        console.log('bad: ', d)
        ok = false;
      }

      let expeditionText: any;

      if (!ok)
        expeditionText = ''
      else {
        let expeditionMonthText = caducateMonthText;
        let expeditionDayText = caducateDayText;
        expeditionText = "20" + expeditionYearText + "-" + expeditionMonthText + "-" + expeditionDayText;
      }


      //this.loginForm.patchValue({ expedition: expeditionText }); //expeditionText });
      this.user.guest.fastcheckin.date_exp = expeditionText;
      resolve();
    });
  }


  private recognizeNationality(lineName) {
    return new Promise<string>((resolve, reject) => {
      /*console.log(Countries.langs['es.json'])
      console.log(Countries.langs)
      Countries.registerLocale(Countries.langs['es.json']);*/
      // var countries = require("i18n-iso-countries");
      // var lang = require("i18n-iso-countries/langs/es.json");
      // countries.registerLocale(lang);
      var line: string = lineName.split('<')[0];
      var nationality = line.substring(line.length - 3);
      //this.loginForm.patchValue({ nationality: countries.getName(nationality, "es") });
      // this.user.guest.fastcheckin.nationality = countries.getName(nationality, "es");

      resolve();
    });
  }

  private recognizeOtherData(lineName) {
    lineName = lineName.replace(/ /g, "");
    console.log(lineName);

    let numberPassport = lineName.substring(0, 9);
    let nacionalidad = lineName.substring(10, 13);
    let birthdateYearText = lineName.substring(13, 15);
    let birthdateMonthText = lineName.substring(15, 17);
    let birthdateDayText = lineName.substring(17, 19);
    let birthdateText = '';
    if (Number(birthdateYearText) > 20) {
      birthdateText = "19" + birthdateYearText + "-" + birthdateMonthText + "-" + birthdateDayText;
    } else {
      birthdateText = "20" + birthdateYearText + "-" + birthdateMonthText + "-" + birthdateDayText;
    }
    let sex = lineName.substring(20, 21);
    let exp_date_year = lineName.substring(21, 23);
    let exp_date_month = lineName.substring(23, 25);
    let exp_date_day = lineName.substring(25, 27);

    let year = Number(exp_date_year) - 10;
    let exp_date: any;

    exp_date = '20' + year.toString() + '-' + exp_date_month + '-' + exp_date_day;

    this.user.guest.fastcheckin.birthday = birthdateText;
    this.user.guest.fastcheckin.sex = sex;
    this.user.guest.fastcheckin.passport.identifier = numberPassport;
    this.user.guest.fastcheckin.date_exp = exp_date;
    this.user.guest.fastcheckin.nationality = nacionalidad;

    this.sex = sex;
  }


  private recognizeNIE(texts) {
    return new Promise<string>((resolve, reject) => {
      texts = texts.replace(/ /g, "");
      console.log(texts);
      // El tipo de documento debe ser "I" 

      resolve();
    });
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.filestring = btoa(binaryString);  // Converting binary string data.
    this.image = this.filestring;

    switch (this.id_img) {
      case 1:
        this.photosNif[0] = "data:image/jpeg;base64," + this.image;
        this.analyze(this.image)
        break;
      case 2:
        this.photosNif[1] = "data:image/jpeg;base64," + this.image;
        if (this.paso != 3) {
          let pasoAnterior = new PasoAnterior();
          pasoAnterior.paso = this.paso;
          pasoAnterior.progreso = this.progreso;
          this.pasosAnteriores.push(pasoAnterior);
          this.paso = 2;
          this.progreso = "25\%";
        }
        break;
      case 3:
        this.photosPassport[0] = "data:image/jpeg;base64," + this.image;
        this.analyze(this.image)
    }

  }

  getFiles(event, id, paso?) {
    this.id_img = id;
    this.files = event.target.files;
    var reader = new FileReader();
    // Guardaos las imagenes tal y como viene para una subida:
    if (id === 1) {
      this.photosNifSubida[0] = this.files[0];
      reader.readAsBinaryString(this.files[0]);
      reader.onload = this._handleReaderLoaded.bind(this);
    } else if (id === 2) {
      this.photosNifSubida[1] = this.files[0];
      reader.readAsBinaryString(this.files[0]);
      reader.onload = this._handleReaderLoaded.bind(this);
    } else if (id === 3) {
      reader.readAsBinaryString(this.files[0]);
      reader.onload = this._handleReaderLoaded.bind(this);
      this.photosPassportSubida[0] = this.files[0];
    }

  }

  anotherGuest() {
    //TODO: Restablecer todos los datos y empezar formulario de nuevo.

  }

  vew_conditions() {
    let archivo = "";
    //this.navCtrl.push('pdf', {"archivo": "data:application/pdf;base64, "+this.condiciones_hotel, animate: true, direction: 'backward' });
    // Para archivos en Base64:
    if (this.condiciones_hotel.substring(0, 4) != "http") {
      archivo = "data:application/pdf;base64, ";
    }
    //TODO: Visualizar condiciones
    // this.navCtrl.push('pdf', { "archivo": archivo + this.condiciones_hotel, animate: true, direction: 'backward' });
  }

  view_policysecurity() {
    //TODO: Visualizar condiciones
    // this.navCtrl.push('pdf', { "archivo": "policysecurity_pdf", animate: true, direction: 'backward' });
  }


  // Visualizar foto:
  visualizaFoto(imagen) {
    //TODO: Visualizar foto
    // const viewer = this.imageViewerCtrl.create(imagen);
    // viewer.present();
  }

  // Borra foto:
  borraFoto(id) {
    switch (id) {
      case 1:
        this.photosNif[0] = 'assets/imgs/fotodenitrasera.png';
        break;
      case 2:
        this.photosNif[1] = 'assets/imgs/fotodenidelantera.png';
        break;
      case 3:
        this.photosPassport[0] = 'assets/imgs/camera.png';
    }

  }

  //Volver atrás
  atras() {
    let pasoAnterior = this.pasosAnteriores.pop();
    this.paso = pasoAnterior.paso;
    this.progreso = pasoAnterior.progreso;
  }

  confirmaImagenes() {
    let pasoAnterior = new PasoAnterior();
    pasoAnterior.paso = this.paso;
    pasoAnterior.progreso = this.progreso;
    this.pasosAnteriores.push(pasoAnterior);
    //this.paso = 4;
    // Volcamos los datos obtenidos en el fastcheckin en caso de éxito:
    this.activarFormularioManual();
    // this.vuelcaDatosFastcheckin();
    if (this.tipoDoc == 'pasaporte') {
      this.progreso = "66\%";
    } else {
      this.progreso = "75\%";
    }
  }


  vuelcaDatosFastcheckin() {
    this.fastcheckin.dni = { identifier: this.user.guest.fastcheckin.dni.identifier };
    // this.fastcheckin.dni.identifier = this.user.guest.fastcheckin.dni.identifier;
    this.fastcheckin.passport = { identifier: this.user.guest.fastcheckin.passport.identifier };
    // this.fastcheckin.passport.identifier = this.user.guest.fastcheckin.passport.identifier;
    this.fastcheckin.date_exp = this.user.guest.fastcheckin.date_exp;
    this.fastcheckin.name = this.user.guest.fastcheckin.name;
    this.fastcheckin.surnameOne = this.user.guest.fastcheckin.surnameOne;
    this.fastcheckin.surnameTwo = this.user.guest.fastcheckin.surnameTwo;
    this.fastcheckin.birthday = this.user.guest.fastcheckin.birthday;
    this.fastcheckin.sex = this.user.guest.fastcheckin.sex;
    this.fastcheckin.nationality = this.user.guest.fastcheckin.nationality;
  }


  activarFormularioManual() {
    this.fastcheckin = new FastCheckin();
    this.erroresRegistroManual = new ErroresFormularioRegistro();
    this.fastcheckin.typeOfDocument = (this.tipoDoc == 'dni') ? 'D' : 'P';
    this.fastcheckin.sex = "M";
    this.vuelcaDatosFastcheckin();
    //Generamos un código aleatorio de 20 caracteres.
    let cadena = this.globalService.generarCadenaAleatoria(20);
    //Subimos la imagen obtenida en la carpeta de errores con el nuevo código generado.
    if (this.tipoDoc == "dni") {
      this.globalService.subirArchivo(this.photosNifSubida[0], "huespedes/errores/dni", cadena).then(res => {
        let asunto = "[TEST] Error al registrarse en webapp con DNI";
        let mensaje = "<p>Se ha producido un error en el registro de un huésped</p><p>Se puede ver la imagen utilizada a través del siguiente enlace:</p><p>" + res + "</p>";
        let mailTo = "javier@becheckin.com, amalia@becheckin.com";
        //Enviamos informe de error.
        this.dm.sendGenericMail(asunto, mensaje, mailTo).then(res => {
          console.log("informe de errores enviado.");
        });
      });
    } else {
      this.globalService.subirArchivo(this.photosPassportSubida[0], "huespedes/errores/passport", cadena).then(res => {
        let asunto = "[TEST] Error al registrarse en webapp con Pasaporte";
        let mensaje = "<p>Se ha producido un error en el registro de un huésped</p><p>Se puede ver la imagen utilizada a través del siguiente enlace:</p><p>" + res + "</p>";
        let mailTo = "javier@becheckin.com, amalia@becheckin.com";
        //Enviamos informe de error.
        this.dm.sendGenericMail(asunto, mensaje, mailTo).then(res => {
          console.log("informe de errores enviado.");
        });
      });
    }
    //Vamos al paso especial para mostrar formulario manual.
    let pasoAnterior = new PasoAnterior();
    pasoAnterior.paso = this.paso;
    pasoAnterior.progreso = this.progreso;
    this.pasosAnteriores.push(pasoAnterior);
    this.paso = 0;
    this.progreso = "50\%";
  }

  guardarDatosManuales() {
    console.log(this.photosNifSubida);
    console.log(this.photosPassportSubida);
    if (this.compruebaDatosRegistroManual()) {
      this.guardarFastcheckin();
    }
  }

  guardarFastcheckin() {
    this.user.guest.fastcheckin.typeOfDocument = this.fastcheckin.typeOfDocument;
    if (this.fastcheckin.typeOfDocument == "D") {
      this.user.guest.fastcheckin.dni.identifier = this.fastcheckin.dni.identifier;
    } else {
      this.user.guest.fastcheckin.passport.identifier = this.fastcheckin.passport.identifier;
    }
    this.user.guest.fastcheckin.date_exp = this.fastcheckin.date_exp;
    this.user.guest.fastcheckin.name = this.fastcheckin.name;
    this.user.guest.fastcheckin.surnameOne = this.fastcheckin.surnameOne;
    this.user.guest.fastcheckin.surnameTwo = this.fastcheckin.surnameTwo;
    this.user.guest.fastcheckin.birthday = this.fastcheckin.birthday;
    this.user.guest.fastcheckin.sex = this.fastcheckin.sex;
    this.user.guest.fastcheckin.nationality = this.fastcheckin.nationality;
    this.user.guest.fastcheckin.province = this.fastcheckin.province ? this.fastcheckin.province : '';
    this.existFastcheckin = true;
    let pasoAnterior = new PasoAnterior();
    pasoAnterior.paso = this.paso;
    pasoAnterior.progreso = this.progreso;
    this.pasosAnteriores.push(pasoAnterior);
    this.paso = 4;
    this.progreso = "75\%";
  }

  compruebaDatosRegistroManual() {
    let result = true;
    if (!this.fastcheckin.typeOfDocument) {
      this.erroresRegistroManual.tipoDocumento = "obligatorio";
      result = false;
    }
    if (this.fastcheckin.typeOfDocument == "D") {
      if (!this.fastcheckin.dni.identifier) {
        this.erroresRegistroManual.numIdentificacion = "obligatorio";
        result = false;
      }
    } else {
      if (!this.fastcheckin.passport.identifier) {
        this.erroresRegistroManual.numIdentificacion = "obligatorio";
        result = false;
      }
    }
    if (!this.fastcheckin.date_exp) {
      this.erroresRegistroManual.fechaExpedicion = "obligatorio";
      result = false;
    }
    if (!this.fastcheckin.name) {
      this.erroresRegistroManual.nombre = "obligatorio";
      result = false;
    }
    if (!this.fastcheckin.surnameOne) {
      this.erroresRegistroManual.apellido1 = "obligatorio";
      result = false;
    }
    // if (!this.fastcheckin.surnameTwo) {
    //   this.erroresRegistroManual.apellido2 = "obligatorio";
    //   result = false;
    // }
    if (!this.fastcheckin.birthday) {
      this.erroresRegistroManual.fechaNacimiento = "obligatorio";
      result = false;
    }
    if (!this.fastcheckin.sex) {
      this.erroresRegistroManual.sexo = "obligatorio";
      result = false;
    }
    if (!this.fastcheckin.nationality) {
      this.erroresRegistroManual.nacionalidad = "obligatorio";
      result = false;
    }
    // FGV: Comprobación fecha expedición y fecha de nacimiento:
    // FEcha expedición franja :   30 años atrás y tope fecha checkin
    // Fecha de nacimiento:  100 años atrás y tope fecha checkin
    // CONTROL FECHA DE EXPEDICIÓN:
    if (this.fastcheckin.date_exp) {
      //TODO: Obtener fecha Inicio checkin
      let fechainicio_checkin = JSON.parse('{"start": "05/05/2019","finish": "05/05/2019"}');
      fechainicio_checkin = new Date(fechainicio_checkin.start);
      let exp = new Date(this.fastcheckin.date_exp);
      let anyo30 = new Date();
      anyo30.setFullYear(anyo30.getFullYear() - 30);
      if (exp < anyo30) {
        this.alerta(this.translate.instant("HUESPED.CONTROL_FECHA_EXPEDICION_TITULO"), this.translate.instant("HUESPED.CONTROL_FECHA_EXPEDICION_INFERIOR"));
        result = false;
      }
      if (exp > fechainicio_checkin) {
        this.alerta(this.translate.instant("HUESPED.CONTROL_FECHA_EXPEDICION_TITULO"), this.translate.instant("HUESPED.CONTROL_FECHAS_SUPERIOR"));
        result = false;
      }
    }
    // CONTROL FECHA DE NACIMIENTO:
    if (this.fastcheckin.birthday) {
      //TODO: Obtener fecha Inicio checkin
      let fechainicio_checkin = JSON.parse('{"start": "05/05/2019","finish": "05/05/2019"}');
      fechainicio_checkin = new Date(fechainicio_checkin.start);
      let exp = new Date(this.fastcheckin.birthday);
      let anyo100 = new Date();
      anyo100.setFullYear(anyo100.getFullYear() - 100);
      if (exp < anyo100) {
        this.alerta(this.translate.instant("HUESPED.CONTROL_FECHA_NACIMIENTO_TITULO"), this.translate.instant("HUESPED.CONTROL_FECHA_NACIMIENTO_INFERIOR"));
        result = false;
      }
      if (exp > fechainicio_checkin) {
        this.alerta(this.translate.instant("HUESPED.CONTROL_FECHA_NACIMIENTO_TITULO"), this.translate.instant("HUESPED.CONTROL_FECHAS_SUPERIOR"));
        result = false;
      }
    }

    this.erroresRegistroManual.tieneErrores = !result;
    return result;
  }

  modificaCampoRegistroManual(campo) {
    switch (campo) {
      case "tipoDocumento":
        this.erroresRegistroManual.tipoDocumento = "";
        break;
      case "numIdentificacion":
        this.erroresRegistroManual.numIdentificacion = "";
        break;
      case "fechaExpedicion":
        this.erroresRegistroManual.fechaExpedicion = "";
        break;
      case "nombre":
        this.erroresRegistroManual.nombre = "";
        break;
      case "apellido1":
        this.erroresRegistroManual.apellido1 = "";
        break;
      case "apellido2":
        this.erroresRegistroManual.apellido2 = "";
        break;
      case "fechaNacimiento":
        this.erroresRegistroManual.fechaNacimiento = "";
        break;
      case "sexo":
        this.erroresRegistroManual.sexo = "";
        break;
      case "nacionalidad":
        this.erroresRegistroManual.nacionalidad = "";
        break;

      default:
        break;
    }
    if (!this.erroresRegistroManual.tipoDocumento &&
      !this.erroresRegistroManual.numIdentificacion &&
      !this.erroresRegistroManual.fechaExpedicion &&
      !this.erroresRegistroManual.nombre &&
      !this.erroresRegistroManual.apellido1 &&
      // !this.erroresRegistroManual.apellido2 &&
      !this.erroresRegistroManual.fechaNacimiento &&
      !this.erroresRegistroManual.sexo &&
      !this.erroresRegistroManual.nacionalidad
    ) {
      this.erroresRegistroManual.tieneErrores = false;
    }
  }

  cambiarTipoDocumento(tipoDocumento) {
    this.fastcheckin.typeOfDocument = tipoDocumento;
  }
  cambiarSexo(tipoSexo) {
    this.fastcheckin.sex = tipoSexo;
  }

  resetFile(id) {
    let input: any = document.getElementById(id);
    input.value = null;
  }

}
