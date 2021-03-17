import { Injectable } from '@angular/core';
import { TcompetenzaProdotto } from './../classes/T_competenza_prodotto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TcompetenzaProdottoService {

 tcompetenzaProdotti: TcompetenzaProdotto[] = [];
 tcompetenzaProdotto: TcompetenzaProdotto;

 private rotta = "/tcompetenzaprod";
 
 private rottalastid  = '/lastid/';


 private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

 private APIURLLAST = environment.APIURL + this.rottalastid;
 
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

getCompetenze() {

  // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

  // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

      // primo metodo passando il token in chiaro su url
      //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

      // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
       return this.http.get(this.APIURL,  {
            headers: this.getAuthHeader()
          });      // ok
    }

      getCompetenza(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteCompetenza(tcompetenzaProdotto: TcompetenzaProdotto) {
        return this.http.delete(this.APIURL + '/' + tcompetenzaProdotto.id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }

  updateCompetenza(tcompetenzaProdotto: TcompetenzaProdotto) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    tcompetenzaProdotto['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + tcompetenzaProdotto.id, tcompetenzaProdotto,  {
            headers: this.getAuthHeader()
          });      // ok;
  }

   createCompetenza(tcompetenzaProdotto: TcompetenzaProdotto){
    return this.http.post(this.APIURL, tcompetenzaProdotto,  {
          headers: this.getAuthHeader()
        });      // ok;
  }

  getLastid() {

    return this.http.get(this.APIURLLAST,  {
      headers: this.getAuthHeader()
    });      // ok;
  
  }

}
