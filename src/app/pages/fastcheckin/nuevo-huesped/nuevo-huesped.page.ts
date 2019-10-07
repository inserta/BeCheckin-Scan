import { FastCheckin, Guest, DatosReserva } from '../../../models/data.model';
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
import { AlertController, NavController, ModalController } from '@ionic/angular';
// import { AuthProvider } from '../../providers/auth/auth';
import { GoogleCloudVisionServiceProvider } from '../../../providers/vision/google-cloud-vision-service';
// import { DNIValidator } from '../../validators/dni';
// import { ImageViewerController } from "ionic-img-viewer";
import { ImageViewerComponent } from '../../../components/image-viewer/image-viewer.component';

// let moment = require('moment');
// import moment from 'moment';
import { GlobalService } from '../../../services/globalService';
import { ErroresFormularioRegistro, PasoAnterior, DatosDniFrontal, DatosDniTrasero, DatosPasaporte } from '../../../models/others.model';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DataManagement } from 'src/app/services/dataManagement';
// var moment = require('moment');
import * as moment from 'moment';
import * as i18nIsoCountries from 'i18n-iso-countries';
import { CookieService } from 'ngx-cookie-service';
// import * as i18nIsoEsp from 'i18n-iso-countries/langs/es.json';

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

  datosReserva: DatosReserva;
  ready: boolean;
  _idKeyRoom: string;

  datosDniFrontal: DatosDniFrontal;
  datosDniTrasero: DatosDniTrasero;
  datosPasaporte: DatosPasaporte;
  manualForm: FormGroup;
  readyForm: boolean;

  /**
   * Función para comparar objetos y que se seleccione la opción elegida por defecto en el selector del formulario.
   */
  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1 === o2.id : false;
  };
  compareWith = this.compareWithFn;


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
    public modalController: ModalController,
    private vision: GoogleCloudVisionServiceProvider,
    private cryptProvider: CryptProvider,
    private router: Router,
    private loader: LoadingService,
    private route: ActivatedRoute,
    private dm: DataManagement,
    private cookieService: CookieService
  ) {

  }

  ngOnInit() {
    this.inicializaHuesped();

    this.inicializaReserva();

    this.inicializaCondiciones();

    this.manualForm = this.formBuilder.group({
      numIdentificacion: ['', Validators.compose([Validators.required])],
      fechaExpedicion: [null, Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
      apellido1: ['', Validators.compose([Validators.required])],
      apellido2: [''],
      fechaNacimiento: [null, Validators.compose([Validators.required])],
      sex: ['', Validators.compose([Validators.required])],
      nacionalidad: ['', Validators.compose([Validators.required])],
      provincia: [''],
    });

    this.globalService.leerCookies(true).then(res => {
      if (!res) {
        this.sinPermisos = true;
        this.navCtrl.navigateForward("/login");
      } else {
        //Filtramos las reservas por su id para obtener la reserva seleccionada
        let datosReservas = this.globalService.datosReservas.filter(datosReserva => {
          if (datosReserva.reserva.id) {
            return datosReserva.reserva.id.toString() == this.idReserva;
          } else {
            return false;
          }
        })
        //Puesto que nos devuelve una lista de un único elemento, lo sacamos de la lista y lo guardamos en una variable.
        this.datosReserva = datosReservas[0];
        this._idKeyRoom = this.datosReserva.reserva._id;
        this.ready = true;
        console.log("resultado", res);
        console.log("idReserva", this.idReserva);
      }
    });
  }

  inicializaHuesped() {

    this.datosDniFrontal = new DatosDniFrontal();
    this.datosDniTrasero = new DatosDniTrasero();
    this.datosPasaporte = new DatosPasaporte();

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

  inicializaReserva() {
    if (this.loader.isLoading) {
      this.loader.dismiss();
    }
    this.ready = false;
    this.sinPermisos = false;
    this.idReserva = this.route.snapshot.paramMap.get('idReserva');
  }

  inicializaCondiciones() {
    //TODO: Obtener los términos y condiciones reales
    // this.condiciones_hotel = this.globalService.recepcionista.hotel.doc ? this.globalService.recepcionista.hotel.doc.doc : "";
    this.condiciones_hotel = '';
  }

  filtro() {
    return this.users.filter((user) => {
      return user.fastcheckin != null;
    })
  }

  close() {
    // this.navCtrl.navigateBack("/app/home");
    this.navCtrl.navigateRoot("/reserva/" + this.idReserva + "?cargarDatos=true");
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

    this.crearHuespedSinFastcheckin().then(res => {

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
            if (this.loader.isLoading) {
              this.loader.dismiss();
            }
            console.log('Error subida pasaporte');
            //this.sendProfile();
          });
      }
    }).catch(error => {
      this.alerta("Error", "El huésped no se ha podido crear correctamente, inténtelo de nuevo por favor.");
    });

  }

  crearHuespedSinFastcheckin() {
    return new Promise<any>((resolve, reject) => {
      console.log(this.hotel);
      this.dm.crearHuespedSinFastcheckin(this.datosReserva.reserva.id + "_nombre_" + this.datosReserva.huespedes.length + "_" + this.globalService.generarCadenaAleatoria(4), this.datosReserva.reserva.id + "_email_" + this.datosReserva.huespedes.length + "_" + this.globalService.generarCadenaAleatoria(4) + "@email.com", this.globalService.generarCadenaAleatoria(50), this._idKeyRoom).then(res => {
        console.log("Respuesta crear huesped: ", res);
        this.user.guest._id = res.guest._id;
        this.user.guest.name = res.guest.name;
        this.user.guest.email = res.guest.email;
        this.user.guest.tokenFirebase = res.guest.tokenFirebase;
        this.user.guest.versionAPI = res.guest.versionAPI;
        resolve(res);
      }).catch(error => {
        console.log("Error al crear huesped: ", error);
        reject(error);
      })
    });
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
    setTimeout(() => {
      if (this.existFastcheckin) {
        // No tiene condiciones hotel:
        if (this.condiciones_hotel.length == 0) {
          if (this.policysecurity) {
            this.savePad();
            // this.user.guest.fastcheckin.email = this.email;
            // this.user.guest.email = this.email;
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
    }, 1);
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
    switch (this.id_img) {
      case 1:
        console.log("Analizando dni trasero!!");
        break;
      case 2:
        console.log("Analizando dni delantero!!");
        break;
      case 3:
        console.log("Analizando pasaporte!!");
    }

    try {

      try {
        this.vision.getLabels(image).subscribe((result: any) => {
          console.log(result);
          let res = result.responses[0].fullTextAnnotation;
          if (res) {
            //this.typeDocument = res.responses[0].fullTextAnnotation.text.indexOf('passport') >= 0 || res.responses[0].fullTextAnnotation.text.indexOf('PASSPORT') >= 0 ? 'P' : 'D';

            if (this.tipoDoc == 'dni') {
              console.log('dni')
              this.dm.crearOcrDniTrasero(res.text, this.datosDniFrontal).then(respuestaDniTrasero => {
                this.typeDocument = 'D';
                this.datosDniTrasero = respuestaDniTrasero;
                this.recognizeDNIText();
              });
            } else {
              this.dm.crearOcrPasaporte(res.text).then(respuestaPasaporte => {
                this.typeDocument = 'P';
                this.datosPasaporte = respuestaPasaporte;
                this.recognizePassportText();
              });
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
        this.loader.dismiss();
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
      this.loader.dismiss();
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
    this.fastcheckin.imagenes = this.linksSubidos;

    // Introducimos el _id del huesped en el fastcheckin
    this.user.guest.fastcheckin._id = this.user.guest._id;
    this.fastcheckin._id = this.user.guest._id;


    let fastcheckin = this.cryptProvider.encryptData(this.user);
    console.log(fastcheckin.toString());

    this.dm.setFastcheckin(this.user.guest._id, fastcheckin.toString())
      .then((response) => {
        // this.serviceAPI.actualGuests.push(this.user.guest);
        // this.user.guest.fastcheckin = CryptProvider.decryptData(fastcheckin.toString(), this.user.guest._id);
        // console.log('Fast: ', this.user.guest.fastcheckin);
        // var fechaInicio = new Date(this.user.guest.fastcheckin.birthday).getTime();
        // var fechaFin = new Date().getTime();

        // var diff = fechaFin - fechaInicio;

        // var edad = diff / (1000 * 60 * 60 * 24 * 365)

        // console.log(diff / (1000 * 60 * 60 * 24 * 365));
        // this.serviceAPI.actualUser.edad = edad
        // this.storageService.setUserData(this.user);
        // this.events.publish('setUser', this.user);
        this.dataUpdate = true;
        // this.serviceAPI.getHotel(this.user.keysRooms[0].client._id).then(hotel => {
        //   console.log('h: ', hotel)
        //   let mail = this.user.keysRooms[0].client.email;

        //   if ((hotel[0].email) && (hotel[0].email != hotel[0].user) && (hotel[0].email != '')) {
        //     mail = mail + ', ' + hotel[0].email;
        //     if (hotel[0].activo == '0')
        //       mail = hotel[0].email;
        //   }

        //   console.log('email to: ', mail)
        console.log("enviando email a: " + this.globalService.recepcionista.hotel.email)
        let asunto = "Nuevo Fastcheckin";
        let mailTo = this.globalService.recepcionista.hotel.email;
        let cco = "amalia@becheckin.com, lidia@becheckin.com";
        let nombreHuesped = this.fastcheckin.name;
        let nombreReserva = this.datosReserva.reserva.id;
        let fechaInicio = this.muestraFechaString(this.datosReserva.reserva.roomReservations[0].checkin);
        let fechaFin = this.muestraFechaString(this.datosReserva.reserva.roomReservations[0].checkout);
        let fastcheckin: FastCheckin = this.fastcheckin;
        let mensaje = "<!doctype html><html><head><title>Becheckin<\/title><style>.cuerpo{margin: 2%;background: #003581;border-radius: 10px;border: 2px solid #444;box-shadow: 0px 0px 10px 4px #888888;color:#E5E5E5;padding: 1%;}.imagen{margin-top: 10px;margin-bottom: 5px;display: flex;justify-content: center;align-items: center;}img{margin: 0 auto; border-radius: 5px;overflow: hidden;}.bienvenida{margin-left: 3%;margin-right: 3%;font-size: 20px;font-weight: bold;}.nombre{color: #f9ffac;}.reserva{font-weight: bold;color: #ecffbf;}.texto{margin-top: 20px;margin-left: 6%;margin-right: 6%;font-size: 18px;}.fecha1{color: #c4ffb5;}.fecha2{color: #ffb5b5;}.info{margin-bottom: 10px;}.fechas{margin-bottom: 10px;}.datos{margin-bottom: 10px;}.dato{font-size: 14px;margin: 5px 2%;}.texto_final{margin-bottom: 30px;font-size: 14px;font-style: italic;}a{color: #feffce;}.pie{text-align: center;font-style: italic;color: #7e7e7e;}<\/style><\/head><body><div class='cuerpo'><div class='imagen'><img src='https:\/\/dashboard.becheckin.com\/imgs\/logo\/inserta.png' width='50' height='50' \/><\/div><div class='bienvenida'>Hola <span class='nombre'>" + (nombreHuesped ? nombreHuesped : "") + "<\/span><\/div><div class='texto'><div class='info'>Tu reserva <span class='reserva'>" + (nombreReserva ? nombreReserva : "") + "<\/span> tiene un nuevo FastCheckin.<\/div><div class='fechas'>Entrada <span class='fecha1'>" + (fechaInicio ? fechaInicio : "") + "<\/span> | Salida <span class='fecha2'>" + (fechaFin ? fechaFin : "") + "<\/span><\/div><div class='datos'>Datos huésped:<div class='dato'>Nombre: " + (fastcheckin.name ? fastcheckin.name : "") + "<\/div><div class='dato'>Apellidos: " + (fastcheckin.surnameOne ? fastcheckin.surnameOne : "") + "<\/div><div class='dato'>Fecha Nacimiento: " + (fastcheckin.birthday ? fastcheckin.birthday : "") + "<\/div><div class='dato'>Fecha Expedicion: " + (fastcheckin.date_exp ? fastcheckin.date_exp : "") + "<\/div><div class='dato'>Dni: " + (fastcheckin.dni.identifier ? fastcheckin.dni.identifier : "") + "<\/div><div class='dato'>Pasaporte: " + (fastcheckin.passport.identifier ? fastcheckin.passport.identifier : "") + "<\/div><div class='dato'>Nacionalidad: " + (fastcheckin.nationality ? fastcheckin.nationality : "") + "<\/div><div class='dato'>Sexo: " + (fastcheckin.sex ? fastcheckin.sex : "") + "<\/div><div class='dato'>Email: " + (fastcheckin.email ? fastcheckin.email : "") + "<\/div><\/div><div class='texto_final'>Puedes consultar los datos FastCheckin en tu dashboard: <a href='https:\/\/dashboard.becheckin.com'target='_blank' style='color:#feffce;'>https:\/\/dashboard.becheckin.com <\/a><br \/>Nos tienes siempre a tu disposición en Booking@becheckin.com y en el teléfono +34 627 07 41 73.<\/div><\/div><\/div><\/body><footer><hr \/><div class='pie'>Atentamente, BeCheckin Team.<\/div><\/footer><\/html>";
        this.dm.sendGenericMail(asunto, mensaje, mailTo, "", cco).then(res => {
          this.enviaPushMasterYield();
          console.log(res);
          if (this.loader.isLoading) {
            this.loader.dismiss();
          }
          this.checkKeyPermisions();
        });

        // })

      });
  }

  private enviaPushMasterYield() {
    let nombrePMS = '';
    let hotel = this.globalService.recepcionista.hotel;
    console.log("hotel", hotel);
    if (hotel.pms) {
      if (hotel.pms.pms_user) {
        nombrePMS = hotel.pms.pms_user.toUpperCase();
      }
    }
    if (this.datosReserva.pms && nombrePMS == '') {
      nombrePMS = this.datosReserva.pms.toUpperCase();
    }
    if (nombrePMS == 'MASTERYIELD') {
      this.dm.sendPushToMasteryield(this.datosReserva.reserva.id).then(res => {
        console.log("push masteryield", res);
      });
    }
  }

  private muestraFechaString(fecha: Date): string {
    return this.leftpad(fecha.getDate(), 2) + "-" + this.leftpad(fecha.getMonth() + 1, 2) + '-' + fecha.getFullYear();
  }
  //Método utilizado para formatear la fecha en string
  private leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
      + String(val)).slice(String(val).length);
  }

  private recognizePassportText() {
    this.user.guest.fastcheckin.name = this.datosPasaporte.nombre;
    this.user.guest.fastcheckin.surnameOne = this.datosPasaporte.apellido1;
    this.user.guest.fastcheckin.surnameTwo = this.datosPasaporte.apellido2;
    this.user.guest.fastcheckin.passport.identifier = this.datosPasaporte.documento;
    this.user.guest.fastcheckin.sex = this.datosPasaporte.sexo;
    this.user.guest.fastcheckin.birthday = this.datosPasaporte.nacimiento;
    this.user.guest.fastcheckin.date_exp = this.datosPasaporte.expedicion;
    this.user.guest.fastcheckin.nationality = this.datosPasaporte.pais;
    this.loader.dismiss();
    this.comprobardatos();
  }

  private recognizeDNIText() {
    this.user.guest.fastcheckin.name = this.datosDniTrasero.nombre;
    this.user.guest.fastcheckin.surnameOne = this.datosDniTrasero.apellido1;
    this.user.guest.fastcheckin.surnameTwo = this.datosDniTrasero.apellido2;
    this.user.guest.fastcheckin.dni.identifier = this.datosDniTrasero.documento;
    this.user.guest.fastcheckin.sex = this.datosDniTrasero.sexo;
    this.user.guest.fastcheckin.birthday = this.datosDniTrasero.nacimiento;
    this.user.guest.fastcheckin.date_exp = this.datosDniTrasero.expedicion;
    this.user.guest.fastcheckin.nationality = this.datosDniTrasero.pais;
    this.loader.dismiss();
    this.comprobardatos();
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
        this.analyze(this.image);
        break;
      case 2:
        this.photosNif[1] = "data:image/jpeg;base64," + this.image;
        this.analizaDNIDelantero(this.image);
        break;
      case 3:
        this.photosPassport[0] = "data:image/jpeg;base64," + this.image;
        this.analyze(this.image);
    }

  }

  getFiles(event, id, paso?) {
    this.id_img = id;
    this.files = event.target.files;
    var reader = new FileReader();
    this.loader.present();
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

  async viewImage(src: string, title: string = '', description: string = '', tipo: string = '') {
    this.loader.present();
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        src: src,
        titulo: title,
        descripcion: description,
        tipo: tipo
      },
      cssClass: 'modal-fullscreen',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  async viewPDF(tipo_doc: string = '') {
    this.loader.present();
    let src: string = '';
    let title: string = 'Documento';
    let description: string = '';
    let tipo: string = 'pdf';
    let language = this.cookieService.get('langRecepApp');
    if (tipo_doc == 'privacidad') {
      description = "Política de privacidad";
      src = 'https://dashboard.becheckin.com/documentos/policysecurity_' + language + '.pdf';
    } else if (tipo_doc == 'condiciones') {
      description = "Términos y condiciones";
      if (this.condiciones_hotel.substring(0, 4) != "http") {
        src = "data:application/pdf;base64, " + this.condiciones_hotel;
      } else {
        src = this.condiciones_hotel;
      }
    }
    let oS = this.getMobileOperatingSystem();

    let isPhone = oS != 'unknown';

    if(isPhone){
      this.loader.dismiss();
      window.open('https://dashboard.becheckin.com/documentos/policysecurity_' + language + '.pdf',"_blank");
    } else {
      const modal = await this.modalController.create({
        component: ImageViewerComponent,
        componentProps: {
          src: src,
          titulo: title,
          descripcion: description,
          tipo: tipo
        },
        cssClass: 'modal-fullscreen',
        keyboardClose: true,
        showBackdrop: true
      });
      return await modal.present();
    }

  }

  /**
   * Determine the mobile operating system.
   * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
   *
   * @returns {String}
   */
  getMobileOperatingSystem() {
    let userAgent = navigator.userAgent || navigator.vendor || window.navigator.userAgent;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    }

    return "unknown";
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
    if (this.paso == 1) {
      this.inicializaHuesped();
      this.inicializaReserva();
    }
  }

  confirmaImagenes() {
    // let pasoAnterior = new PasoAnterior();
    // pasoAnterior.paso = this.paso;
    // pasoAnterior.progreso = this.progreso;
    // this.pasosAnteriores.push(pasoAnterior);
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
    // COMENTAMOS EL SIGUIENTE CÓDIGO PARA EVITAR EL ENVÍO DE ERRORES
    // if (this.tipoDoc == "dni") {
    //   this.globalService.subirArchivo(this.photosNifSubida[0], "huespedes/errores/dni", cadena).then(res => {
    //     let asunto = "[TEST] Error al registrarse en webapp con DNI";
    //     let mensaje = "<p>Se ha producido un error en el registro de un huésped</p><p>Se puede ver la imagen utilizada a través del siguiente enlace:</p><p>" + res + "</p>";
    //     let mailTo = "javier@becheckin.com, amalia@becheckin.com";
    //     //Enviamos informe de error.
    //     this.dm.sendGenericMail(asunto, mensaje, mailTo).then(res => {
    //       console.log("informe de errores enviado.");
    //     });
    //   });
    // } else {
    //   this.globalService.subirArchivo(this.photosPassportSubida[0], "huespedes/errores/passport", cadena).then(res => {
    //     let asunto = "[TEST] Error al registrarse en webapp con Pasaporte";
    //     let mensaje = "<p>Se ha producido un error en el registro de un huésped</p><p>Se puede ver la imagen utilizada a través del siguiente enlace:</p><p>" + res + "</p>";
    //     let mailTo = "javier@becheckin.com, amalia@becheckin.com";
    //     //Enviamos informe de error.
    //     this.dm.sendGenericMail(asunto, mensaje, mailTo).then(res => {
    //       console.log("informe de errores enviado.");
    //     });
    //   });
    // }
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
    // Fecha de nacimiento:  120 años atrás y tope fecha checkin
    // CONTROL FECHA DE EXPEDICIÓN:
    if (this.fastcheckin.date_exp) {
      let fechainicio_checkin = new Date(this.datosReserva.reserva.roomReservations[0].checkin);
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
      let fechainicio_checkin = new Date(this.datosReserva.reserva.roomReservations[0].checkin);
      let exp = new Date(this.fastcheckin.birthday);
      let anyo120 = new Date();
      anyo120.setFullYear(anyo120.getFullYear() - 120);
      if (exp < anyo120) {
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


  //Nuevos métodos para OCR

  analizaDNIDelantero(image) {

    console.log('analizando...');
    console.log("imagen destino a guardar: " + this.id_img);

    try {

      try {
        this.vision.getLabels(image).subscribe((result: any) => {
          console.log(result);
          let res = result.responses[0].fullTextAnnotation;
          if (res) {

            this.dm.crearOcrDniFrontal(res.text).then(respuestaDniFrontal => {
              this.datosDniFrontal = respuestaDniFrontal;

              this.recognizeFrontalDNIText();
            });
          } else {
            this.avanzaDNIDelantero("Error: Fallo al reconocer el texto de la imagen");
          }
        }, err => {
          this.avanzaDNIDelantero(err);
        });
      } catch (error) {
        console.log(error);
        this.avanzaDNIDelantero(error);
      }
    } catch (error) {
      this.avanzaDNIDelantero(error);
    }
  }

  avanzaDNIDelantero(mensaje?) {
    this.loader.dismiss();
    console.log(mensaje);
    if (this.paso != 3) {
      let pasoAnterior = new PasoAnterior();
      pasoAnterior.paso = this.paso;
      pasoAnterior.progreso = this.progreso;
      this.pasosAnteriores.push(pasoAnterior);
      this.paso = 2;
      this.progreso = "25\%";
    }
  }

  private recognizeFrontalDNIText() {

    if (this.datosDniFrontal.apellido1) {
      this.user.guest.fastcheckin.surnameOne = this.datosDniFrontal.apellido1;
    }
    if (this.datosDniFrontal.apellido2) {
      this.user.guest.fastcheckin.surnameTwo = this.datosDniFrontal.apellido2;
    }
    if (this.datosDniFrontal.nombre) {
      this.user.guest.fastcheckin.name = this.datosDniFrontal.nombre;
    }
    if (this.datosDniFrontal.pais) {
      this.user.guest.fastcheckin.nationality = this.datosDniFrontal.pais;
    }
    if (this.datosDniFrontal.documento) {
      this.user.guest.fastcheckin.dni.identifier = this.datosDniFrontal.documento;
    }

    this.avanzaDNIDelantero("Analizado correctamente");
  }

}
