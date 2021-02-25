/* interfaccia tabella utenti  */

export interface UserInterface {

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

}
