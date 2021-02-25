
/*  interfaccia della tabella Commanda  */



export interface CommandaInterface {
  id: number;
  idSanfra: number;
  anagrafica_cliente: string;
  idGiornata: number;
  buonoPasto: number;
  numTavolo: number;
  numPersone: number;
  cassaAttuale: number;
  numProdotti: number;
  importoProdotti: number;
  importoCoperto: number;
  importodaPagare: number;
  dtCommanda: Date;
  importoPagato: number;
  resto: number;
  noteCommanda: string;
  stampaEseguita: string;
  stato: number;
  semaphore: string;
  delay: number;
  statoContabile: number;
  statoCucina: number;
  statoBevande: number;
  key_utenti_operation: number;
  created_at:	Date;
  updated_at:	Date;
// campo derivato dalle relazioni
  d_stato_bevande: string;
  d_stato_commanda: string;
  d_stato_Contabile: string;
  d_stato_Cucina: string;

}
