import { UserInterface } from '../interfaces/user';

export class User implements UserInterface {


  id: number;
  cognome: string;
  nome: string;
  idStato: number;
  username: string;
  password: string;
  email: string;
  idRuolo: number;
  idRuolo_Day: number;
  noteUtente: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
// campo derivato dalla relazione con tabella t_stato_manifestazione
  d_ruolo: string;
  d_ruolo_day: string;
  d_Stato_Utente: string;

  constructor()  {

  this.id = 0;
  this.cognome = ' ';
  this.nome = ' ';
  this.idStato = 0;
  this.username = '';
  this.password = '';
  this.email = ' ';
  this.idRuolo = 0;
  this.idRuolo_Day = 0;
  this.noteUtente = ' ';
  this.key_utenti_operation = 0;
  this.created_at = new Date();
  this.updated_at = new Date();
// relazioni
  this.d_ruolo = ' ';
  this.d_ruolo_day = ' ';
  this.d_Stato_Utente = ' ';

  }


}
