import { Injectable } from '@angular/core';
import { Ttipologia } from './../classes/T_tipologia';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TtipologiaService {

  tipologia: Ttipologia[] = [];  // definisco i dati come array vuoto

  private rotta = "/ttipologia";
  // vecchia versione senza environment
  //  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  private rootTipologiaforStato = '/getTipologieforStato/';


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

  getTipolgie() {

    // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
         return this.http.get(this.APIURL,  {
          headers: this.getAuthHeader()
        });         // ok

        }

        getTipologia(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });
        }


        deleteTipologia(tipologia: Ttipologia) {
          return this.http.delete(this.APIURL + '/' + tipologia.id,  {
            headers: this.getAuthHeader()
          });

        }



    updateTipologia(tipologia: Ttipologia) {

      // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
      //
      //   return this.http.patch(this.APIURL + '/' + user.id,user);
      tipologia['_method'] = 'PUT';

      return this.http.patch(this.APIURL + '/' + tipologia.id, tipologia,  {
        headers: this.getAuthHeader()
      });

    }


     createTipologia(tipologia: Ttipologia){
      return this.http.post(this.APIURL, tipologia,  {
        headers: this.getAuthHeader()
      });
    }

    getTipologieforStato(stato: number) {

      // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

      // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

          // primo metodo passando il token in chiaro su url
          //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

          // secondo metodo passando il token non in chiaro come header


           // return this.http.get(this.APIURL + this.rootPersonebyRuolo + ruolo);
            return this.http.get(this.APIURL + this.rootTipologiaforStato + stato,  {
              headers: this.getAuthHeader()
            });

          }

}
