export class Recepcionista {
    _id: string;
    usuario: string;
    hotel: any;
    bienvenida: boolean;
    doc: Documento[];
}

export class Documento {
    Created_date: string;
    doc: string;
    idCliente: string;
    _id: string;
}

//Datos genéricos
export class Hotel {
    reservas: DatosReserva[];
    hijos: Hijo[];
    padre: string;
}

export class Hijo {
    padre: string;
    nombre: string;
    user: string;
    pass: string;
    _id: string;
}

export class DatosReserva {
    reserva: Reservation;
    huespedes: any[];
    tieneFastCheckin: boolean;
    pms: string;
}

export class Reservation {
    totalGuests: number;
    status: string;
    primaryGuest: PrimaryGuest;
    currencyCode: string;
    id: string;
    _id: string;
    roomReservations: RoomReservation[];
    totalPrice: number;
    hotelId: number;
    updateDate: Date;
    bookerIsPrimaryGuest: boolean;
    creationDate: Date;
    cancellationDate: Date;
    booker: Booker;
}

export class PrimaryGuest {
    firstname: string;
    email: string;
}

export class RoomReservation {
    numGuests: number;
    totalRoomPrice: number;
    checkoutUTC: Date;
    checkout: Date;
    roomtypeId: any;
    guest_info: Guest_info;
    status: string;
    rateId: any;
    checkin: Date;
    id: any;
    currencyCode: string;
    checkinUTC: Date;
}

export class Guest_info {
    name: string;
}

export class Booker {
    phone: string;
    lastname: string;
    country: string;
    language: string;
    email: string;
    firstname: string;
    document: string;
}
//Fin datos genéricos

export class Reserva {
    _id: string;
    idReserva: string;
    idHotel: string;
    nombre: string;
    telefono: string;
    email: string;
    huespedes: Huesped[];
    fechaEntrada: Date;
    fechaSalida: Date;
}

export class Huesped {
    _id: string;
    nombre: string;
    apellidos: string;
    email: string;
    tipoDocumentacion: string;
    idDocumentacion: string;
    fechaNac: string;
    sexo: string;
    fechaExpedicion: string;
    firma: string;
    reserva: string;
    imagenes: Imagen[];
    provincia: string;
    nacionalidad: string;
}

export class Imagen {
    enlace: string;
    nombre: string;
}

export class FastCheckin {
    _id: string; // Autogenerado
    tipoDoc: string; // Puede ser: "dni", "pasaporte", "empleado"
    typeOfDocument: string; // Puede ser:
                            // "D" (para dni español), 
                            // "P" (para pasaporte español), 
                            // "I" (para documento extranjero),
                            // "C" (para permiso de conducir español),
                            // "N" (para permiso de residencia español),
                            // "X" (para permiso de residencia de la unión europea)
                            // (Actualmente sólo en uso: "P" y "D" para españoles y extranjeros)
    numDoc: string; // Número de identificación del documento.
    name: string; // Nombre de la persona
    surnameOne: string; // Apellidos de la persona
    surnameTwo: string; // Segundo apellido (sólo para españoles)
    birthday: string; // Fecha de nacimiento
    nationality: string; // País, escrito en español, obtenido con i18nIsoCountries.
    sex: string; // Género, puede ser: "M" (hombre), "F" (mujer)
    date_exp: string; // Fecha de expedición en formato "yyyy-MM-dd"
    caducate: Date; // Fecha de finalización de la reserva
    email: string; // email (opcional)
    signature: string; // firma (imagen)
    imagenes: Imagen[] = []; // Enlace a las imágenes (o imagen en caso de pasaporte) de los documentos.
    province: string; // Provincia (opcional)
    comeFrom: string; // Servidor donde se ha realizado el fastcheckin.
    //Obsoletos, pero mantenemos para Fastcheckins antiguos
    hasDni: boolean; // [Vacío]
    hasPassport: boolean; // [Vacío]
    update: string; // [Vacío] No se utiliza por el momento.
    reserve: string; // [Vacío] Número de la reserva (DownloadCode). Actualmente no se está usando.
    dni: {
        identifier: string; // Identificador del dni actual. 
                            // Se dejará de usar en próximas versiones para seguir utilizando "numDoc"
    };
    passport: {
        identifier: string; // Identificador del pasaporte actual. 
                            // Se dejará de usar en próximass versiones para seguir utilizando "numDoc"
    };
}

export class Cookies {
    idRecepcionista: string;
    idHotel: string;
    idCliente: string;
    filtros: Filtro;
}

export class Filtro {
    fastcheckin: string;
    fechaInicial: string;
    fechaFinal: string;
    buscador: string;
}

//Para fastcheckin
export class User {
    token: string;
    guest: Guest;
    becheckin_guest_token: string = '';
    keysRooms: any = [];

    constructor(){
        this.guest = this.guest ? this.guest : new Guest();
    }

    setUser(user: any) {
        this.guest = this.guest ? this.guest : new Guest();
        this.guest.name = user.displayName ? user.displayName : (user.name ? user.name : '');
        this.guest.email = user.email;
        this.token = user.Yd;
        this.guest.tokenFirebase = user.uid;
    }

    setUserParameters(snapshot: any) {
        this.guest.name = snapshot.child("name").val();
        this.guest.email = snapshot.child("email").val();
        // this.guest.providerId = snapshot.child("providerId").val();
        // this.guest.uid = snapshot.child("uid").val();
        this.token = snapshot.child("token").val();
    }

    setUserDetails(user: any) {
        this.guest.createdAt = user.guest.createdAt;
        this.guest.canLogin = user.guest.canLogin;
        this.guest.clientOf = user.guest.clientOf;
        this.guest.device = user.guest.device;
        this.guest.email = user.guest.email;
        this.guest.fastcheckin = user.guest.fastcheckin ? user.guest.fastcheckin : new FastCheckin();;
        this.guest.isRegister = {
            email: user.isRegister ? user.isRegister.email : '',
            phone: user.isRegister ? user.isRegister.phone : ''
        }
        this.keysRooms = user.guest.keysRooms;
        this.guest.keysRooms = user.guest.keysRooms;
        this.guest.latesLogin = user.guest.latesLogin;
        this.guest.name = user.guest.name;
        this.guest.password = user.guest.password;
        this.guest.phone = user.guest.phone;
        this.guest.sim = user.guest.sim;
        this.guest.surnameOne = user.guest.surnameOne;
        this.guest.surnameTwo = user.guest.surnameTwo;
        this.guest.tokenFirebase = user.guest.tokenFirebase;
        this.guest.versionAPI = user.guest.versionAPI;
    }
}

export class Guest {
    _id: string;
    name: string;
    surnameOne: string;
    surnameTwo: string;
    email: string;
    userLogin: string;
    password: string;
    isRegister: {
        email: string;
        phone: string;
    };
    phone: string;
    device: string;
    sim: string;
    clientOf: any[];
    keysRooms: any[];
    createdAt: Date;
    latesLogin: Date;
    canLogin: boolean;
    versionAPI: string;
    tokenFirebase: string;
    fastcheckin: FastCheckin;
    allowPersonalData:string;
    constructor() {
        this._id = '';
        this.name = '';
        this.surnameOne = '';
        this.surnameTwo = '';
        this.email = '';
        this.isRegister = {
            email: '',
            phone: ''
        }
        this.phone = '';
        this.device = '';
        this.sim = '';
        this.clientOf = [];
        this.keysRooms = [];
        this.createdAt = new Date();
        this.latesLogin = new Date();
        this.canLogin = true;
        this.versionAPI = '';
        this.tokenFirebase = '';
        this.fastcheckin = new FastCheckin();
    }
}

export class DatosReservaServidor {
    numero_reserva: string;
    pms: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    documento: string;
    estado: string;
    precio: string;
    huespedes: string;
    checkin: string;
    checkout: string;
    idReserva: string; //Corresponde al _id de la llave
    _id: string;
}