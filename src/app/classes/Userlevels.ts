
import { userlevelsInterface } from './../interfaces/userlevels';


export class Userlevels implements userlevelsInterface {

  UserLevelID: number;
  UserLevelName: string;
  key_utenti_operation: number;
  data_operation: Date;

  constructor()  {
    this.UserLevelID = 0;
    this.UserLevelName = '';
    this.data_operation = new  Date();
    this.key_utenti_operation = 0;
  }


}
