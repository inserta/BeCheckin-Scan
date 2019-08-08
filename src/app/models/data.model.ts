export class Recepcionista {
    _id: string;
    usuario: string;
    hotel: string;
}

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