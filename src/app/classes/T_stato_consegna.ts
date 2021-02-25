import { TstatoconsegnaInterface } from './../interfaces/t_stato_consegna';


export class TstatoConsegna implements TstatoconsegnaInterface  {

  id: number;
  d_stato_consegna: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

   constructor()  {

    this.id = 0;
    this.d_stato_consegna = ' ';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();

  }

}
