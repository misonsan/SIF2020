/*  interfaccia della tabella Commandaw  */

export interface CommandawInterface {
  id: number;
  idSanfra: number;
  anagrafica_cliente: string;
  idGiornata: number;
  buonoPasto: number;
  stato: number;
  numTavolo: number;
  numPersone: number;
  numProdotti: number;
  importoProdotti: number;
  importoCoperto: number;
  importodaPagare: number;
  dtCommanda: Date;
  importoPagato: number;
  resto: number;
  noteCommanda: string;
  stampaEseguita: string;
// campo derivato dalle relazioni
  d_stato_commanda: string;

}
