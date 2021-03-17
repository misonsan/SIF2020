/*  interfaccia della tabella Cassaw  */



export interface CassawInterface {
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
  }