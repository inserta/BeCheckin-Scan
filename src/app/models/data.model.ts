export class Recepcionista {
    _id: string;
    usuario: string;
    hotel: string;
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
}

export class Reservation {
    totalGuests: number;
    status: string;
    primaryGuest: PrimaryGuest;
    currencyCode: string;
    id: number;
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
    date_exp: Date;
    caducate: Date;
    _id: string;
    email: string;
    signature: string;
    reserve: string;
    update: string;
    hasDni: boolean;
    hasPassport: boolean;
    tipoDoc: string;
    imagenes: any = [];
    province: string;
}

export class Cookies {
    idRecepcionista: string;
    idHotel: string;
    filtros: Filtro;
}

export class Filtro {
    fastcheckin: string;
    fechaInicial: Date;
    fechaFinal: Date;
    buscador: string;
}