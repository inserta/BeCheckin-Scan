import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataManagement } from '../services/dataManagement';
import { Router } from '@angular/router';
import { Recepcionista, Cookies, Hotel, DatosReserva, Reservation, RoomReservation } from '../models/data.model';
import { LoadingService } from './loading.service';
import { CryptProvider } from '../providers/crypt/crypt';
import { NavController } from '@ionic/angular';

@Injectable()
export class GlobalService {

  //Variables
  recepcionista: Recepcionista;
  hotel: Hotel;
  hijos: any;

  llaves: any[];
  datosReservas: DatosReserva[] = [];

  cookies: Cookies;

  constructor(
    private cookieService: CookieService,
    private loader: LoadingService,
    private dm: DataManagement,
    private nav: NavController,
    private router: Router
  ) {
    this.initialize();
  }

  private initialize() {

    //Inicializamos variables
    this.recepcionista = null;
    this.hotel = null;
    this.llaves = [];
    this.datosReservas = [];
    this.cookies = null;

  }

  /**
   * Método para leer las cookies y cargar todos los datos de la aplicación.
   * @param sinLoader Opcional, para que no aparezca el icono de carga.
   * @param forzarCarga Opcional, "true" para forzar la carga de datos en la lectura.
   */
  leerCookies(sinLoader?: boolean, forzarCarga?: boolean) {
    return new Promise<boolean>((resolve, reject) => {
      //Comprobamos si existen las cookies, se comprueba cadena "null" ya que en algunos navegadores no funciona bien el borrado.
      //Para solucionarlo lo que hacemos es setear la variable a null (pero por defecto en las cookies todo son strings)
      if (this.cookieService.get('directScanData') && this.cookieService.get('directScanData') != "null") {
        let cargarDatos: boolean = false;
        //En caso de existir, cogemos todos los datos y los guardamos en la variable global.
        this.cookies = JSON.parse(this.cookieService.get('directScanData'));

        //Comprobamos que las cookies básicas existen, en caso contrario devolvemos false.
        if (!this.cookies.idHotel || !this.cookies.idRecepcionista) {
          resolve(false);
        }
        //Comprobamos si existe un recepcionista
        if (!this.recepcionista) {
          cargarDatos = true;
        } else if (!this.recepcionista._id) {
          cargarDatos = true;
        } else if (forzarCarga) {
          cargarDatos = true;
        }
        //En caso de no tener un recepcionista, cargaremos todos los datos de la aplicación en base a las cookies obtenidas
        if (cargarDatos) {
          if (!this.loader.isLoading && !sinLoader) {
            //Inicializamos el icono de carga
            this.loader.present();
          }
          //Cargamos todos los datos.
          this.cargarDatos(this.cookies).then(res => {
            //Paramos el icono de carga
            if (!sinLoader) {
              this.loader.dismiss();
            }
            //Comprobamos que los datos se han cargado correctamente.
            if (res) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          //En caso de tener las cookies y el recepcionista, asumimos que todos los datos están bien cargados y devolvemos true.
          resolve(true);
        }
      } else {
        //En caso de no existir, devolvemos false.
        resolve(false);
      }
    });
  }

  guardarCookies(cookies: Cookies) {
    this.cookies = cookies;
    this.cookieService.set('directScanData', JSON.stringify(cookies));
  }

  /**
   * Método de carga de datos en la aplicación
   * @param cookies Elemento de tipo "Cookies"
   * @param recepcionista Opcional, si se recibe se cargan directamente los datos del recepcionista sin llamar a la API.
   */
  cargarDatos(cookies: Cookies, recepcionista?: Recepcionista) {
    return new Promise<boolean>((resolve, reject) => {
      let promises = [];

      promises.push(this.dm.getCliente(cookies.idCliente));

      //Obtenemos todos los datos del recepcionista, hotel e "hijos" del hotel.
      if (!recepcionista) {
        promises.push(this.dm.getRecepcionista(cookies.idRecepcionista));
      }

      Promise.all(promises).then(res => {
        console.log(res);
        let datosCliente = res[0];

        //Recepcionista
        if (!recepcionista) {
          let datosRecepcionista = res[1];
          this.hijos = datosRecepcionista.hijos;
          this.recepcionista = datosRecepcionista.recepcionista[0];
        } else {
          this.recepcionista = recepcionista;
        }

        //Cliente
        this.llaves = datosCliente.keysRooms;
        this.datosReservas = [];
        for (let fc of this.llaves) {
          if (!this.compruebaId(fc)) {
            if (fc.downloadCode) {
              let datosReserva: DatosReserva = new DatosReserva();
              let reserva = new Reservation;
              reserva.id = fc.downloadCode;
              let roomReservations = [];
              let roomReservation = new RoomReservation();
              roomReservation.checkin = new Date(fc.start);
              roomReservation.checkout = new Date(fc.finish);
              roomReservations.push(roomReservation);
              reserva.roomReservations = roomReservations;
              datosReserva.reserva = reserva;
              datosReserva.huespedes = this.huespedesDeReserva(reserva.id);
              datosReserva.tieneFastCheckin = datosReserva.huespedes.length > 0;
              this.incluirReserva(datosReserva);
            }
          }
        }
        this.datosReservas = this.datosReservas.sort((r1, r2) => {
          return (r1.reserva.roomReservations[0].checkin < r2.reserva.roomReservations[0].checkin) ? 1 : -1;
        });
        console.log("this.datosReservas",this.datosReservas);
        if (this.recepcionista.hotel.idBooking != '-' && this.recepcionista.hotel.idBooking != 'Admin') {
          console.log("Hotel enlazado a booking detectado");
          let promesas = [];
          this.datosReservas.forEach(datosReserva => {
            //TODO: Descomentar la siguiente linea cuando esté implementado el método en el backend.
            // promesas.push(this.dm.getReservaBooking(this.recepcionista.hotel.idCliente, this.recepcionista.hotel.idBooking));
          });
          Promise.all(promesas).then(res => {
            console.log(res);
            resolve(true);
          }).catch(error => {
            console.log(error);
            resolve(false);
          });
        } else {
          resolve(true);
        }
      }).catch(res => {
        resolve(false);
      });
    });
  }

  /**
   * El método comprobará si la reserva introducida cumple los filtros. En caso positivo la reserva se añadirá a la lista.
   * @param datosReserva Datos de la reserva que se incluirá
   */
  incluirReserva(datosReserva: DatosReserva) {

    let fechaInicial = new Date(this.cookies.filtros.fechaInicial);
    let fechaFinal = new Date(this.cookies.filtros.fechaFinal);
    let checkin = new Date(datosReserva.reserva.roomReservations[0].checkin);
    fechaInicial.setHours(0, 0, 0, 0);
    fechaFinal.setHours(0, 0, 0, 0);
    checkin.setHours(0, 0, 0, 0);
    if (fechaInicial <= checkin && fechaFinal >= checkin) {
      switch (this.cookies.filtros.fastcheckin) {
        case "todos":
          this.datosReservas.push(datosReserva);
          break;
        case "con_fastcheckin":
          if (datosReserva.tieneFastCheckin) {
            this.datosReservas.push(datosReserva);
          }
          break;
        case "sin_fastcheckin":
          if (!datosReserva.tieneFastCheckin) {
            this.datosReservas.push(datosReserva);
          }
          break;

        default:
          this.datosReservas.push(datosReserva);
          break;
      }

    }
  }

  compruebaId(fc) {
    let res = false;
    if (fc.downloadCode) {
      for (let r of this.datosReservas) {
        if (r.reserva.id) {
          if (r.reserva.id.toString() == fc.downloadCode.toString()) {
            res = true;
            break;
          }
        }
      }
    }
    return res;
  }

  huespedesDeReserva(reservaId) {
    let fastCheckins = this.llaves.filter(llave =>
      llave.downloadCode == reservaId
    );
    let checkDuplicados = [];
    let huespedes = [];
    for (let fc of fastCheckins) {
      if (fc.guest) {
        for (let huesped of fc.guest) {
          if (huesped.fastcheckin) {
            if (
              !huespedes.includes(
                huespedes.filter(res =>
                  res._id == huesped._id))
            ) {
              let decrypted: any = CryptProvider.decryptData(huesped.fastcheckin.toString(), huesped._id);
              //huespedes.push(decrypted);
              const documento = (decrypted.typeOfDocument.toLowerCase() === 'dni' || decrypted.typeOfDocument.toLowerCase() === 'd') ? decrypted.dni.identifier : decrypted.passport.identifier;
              if (!checkDuplicados.includes(documento)) {
                checkDuplicados.push(documento);
                huespedes.push(decrypted);
              }
            }
          }
        }
      }
    }
    return huespedes;
  }


  // Método para subir archivos en 1&1
  subirArchivo(file, ruta, nombre?) {

    return new Promise<string>((resolve, reject) => {
      // file: contiene el fichero subido. Si no se recibe, no sube ningún fichero.
      // ruta: indica la carpeta donde se guardará el fichero
      // nombre: indica el nombre del archivo (la extensión la detecta automáticamente la función)
      // La ruta donde se guarda es: "https://dashboard.becheckin.com/imgs/[ruta]/nombre"

      if (file) {

        let regex = /(?:\.([^.]+))?$/;
        let extension = regex.exec(file.name)[1];
        let formData = new FormData();

        formData.append('selectFile', file, file.name);
        formData.append('path', ruta); // indicamos la carpeta donde grabar el fichero
        formData.append('remotename', nombre ? nombre + "." + extension : ''); // dejar en blanco si no queremos especificar ninguno. En su defecto el nombre del fichero subido
        console.log(formData);

        this.dm.subirArchivo(formData).then(uploaded => {
          console.log(uploaded);
          if (uploaded.Status === 1) {
            resolve("https://dashboard.becheckin.com/imgs/" + ruta + "/" + (nombre ? nombre + "." + extension : file.name));
          } else {
            resolve("error");
          }
        }, err => {
          console.log(err);
          resolve("error");
        });

      } else {

        resolve("salto")

      }
    });
  }

  generarCadenaAleatoria(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  cerrarSesion() {
    this.loader.present("¡Hasta pronto!");
    // Seteamos a null, ya que el borrado no funciona en todos los navegadores.
    // this.cookieService.delete("directScanData");
    // Ojo, la cookie será el string "null", y no el valor nulo.
    this.cookieService.set('directScanData', null);
    this.initialize();
    setTimeout(() => {
      this.loader.dismiss();
      this.nav.navigateRoot("/login");
    }, 500);
  }
}