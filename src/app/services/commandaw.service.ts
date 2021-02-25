import { Injectable } from '@angular/core';
import { Commandaw } from './../classes/Commandaw';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommandawService {

  // lettura dati da server Sifapi
  commandaw: Commandaw[] = [];  // definisco i dati come array vuoto

  private rotta = "/commandaw";


  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
  private tipoFiltro = 0;

  constructor(private http: HttpClient, private auth: AuthService) { }

  // attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato


 getAuthHeader(): HttpHeaders   {
   // passo il token dentro a header per non farlo passare in chiaro su url

   const headers = new HttpHeaders(
       {
           Authorization: 'Bearer ' +  this.auth.getToken()
       }
     );
     return headers;
   }


 getCommandew() {

   // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

   // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

       // primo metodo passando il token in chiaro su url
       //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

       // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
        return this.http.get(this.APIURL,  {
          headers: this.getAuthHeader()
        });      // ok);      // ok


       }

       getCommandaw(id: number) {
         return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
       }


       deleteCommanda(id) {
         return this.http.delete(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;

       }



   updateCommanda(commandaw: Commandaw) {

     // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
     //
     //   return this.http.patch(this.APIURL + '/' + user.id,user);
     commandaw['_method'] = 'PUT';

     return this.http.patch(this.APIURL + '/' + commandaw.id, commandaw,  {
      headers: this.getAuthHeader()
    });      // ok;

   }


    createCommanda(commandaw: Commandaw){
     return this.http.post(this.APIURL, commandaw,  {
      headers: this.getAuthHeader()
    });      // ok;
   }

}
