import { CassawInterface } from './../interfaces/cassaw';

export class Cassaw implements CassawInterface {

    id: number;
    idDay: number;
    dtGiornata: Date;
    statoCassa: number;
    i100: number;
    i100Valore: number;
    i050: number;
    i050Valore: number;
    i020: number;
    i020Valore: number;
    i010: number;
    i010Valore: number;
    i005: number;
    i005Valore: number;
    monete: number;
    totale: number;
    created_at:	Date;
    updated_at:	Date;

  constructor() {
    this.id = 0;
    this.idDay = 0;
    this.dtGiornata = new Date();
    this.statoCassa = 0;
    this.i100 = 0;
    this.i050 = 0;
    this.i020 = 0;
    this.i010 = 0;
    this.i005 = 0;
    this.i100Valore = 0;
    this.i050Valore = 0;
    this.i020Valore = 0;
    this.i010Valore = 0;
    this.i005Valore = 0;
    this.monete = 0;
    this.totale = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}

