export class Recepcionista {
    _id: string;
    usuario: string;
    hotel: any;
    bienvenida: boolean;
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
    typeOfDocument: string;
    dni: {
        identifier: string;
    };
    passport: {
        identifier: string;
    };
    name: string;
    surnameOne: string;
    surnameTwo: string;
    birthday: string;
    nationality: string;
    sex: string;
    date_exp: string;
    caducate: Date;
    _id: string;
    email: string;
    signature: string;
    reserve: string;
    update: string;
    hasDni: boolean;
    hasPassport: boolean;
    tipoDoc: string;
    imagenes: Imagen[] = [];
    province: string;
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
    _idLlave: string;
    _id: string;
}