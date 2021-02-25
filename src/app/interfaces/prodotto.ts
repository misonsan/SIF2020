/* interfaccia tabella Prodotti  */

export class ProdottoInterface {

  id: number;
  descrizione_prodotto: string;
  stato: number;
  tipologia: number;
  categoria: number;
  competenza: number;
  disponibile: number;
  disponibile_Day: number;
  scorta_minima: number;
  aMenu: string;
  prezzo: number;
  prezzo_day: number;
  qta_vendute: number;
  residuo: number;
  photo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
	// campo derivato dalle relazioni
  d_stato_prodotto
  d_Competenza
  d_Categoria
  d_Tipologia


}
