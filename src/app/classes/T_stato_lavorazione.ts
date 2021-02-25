import { TstatolavorazioneInterface } from './../interfaces/t_stato_lavorazione';


export class TstatoLavorazione implements TstatolavorazioneInterface  {

  id: number;
  d_stato_lavorazione: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

   constructor()  {

    this.id = 0;
    this.d_stato_lavorazione = ' ';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();

  }

}
