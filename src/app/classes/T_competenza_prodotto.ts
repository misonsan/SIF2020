import { TcompetenzaProdottoInterface } from './../interfaces/t_competenza_prodotto';


export class Tcategoriaprodotto implements TcompetenzaProdottoInterface  {

  id: number;
  d_competenza: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

   constructor()  {

    this.id = 0;
    this.d_competenza = ' ';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();

  }

}
