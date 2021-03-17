import { Injectable } from '@angular/core';
import { Manifestazione } from './../classes/Manifestazione';
//import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManifestazioneService {

  // lettura dati da server laraapi
  manif: Manifestazione[] = [];  // definisco i dati come array vuoto

  private rotta = "/manif";

  private rottaLast = "/manifestazione";
  private rootManiflastid  = "/lastid";
  private rootRicercaStato  = "/getManifestazionebyStato/";

// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

private APIURLLAST = environment.APIURL + this.rottaLast;

private APIURLSEARCH = '';

  constructor(private http: HttpClient, private auth: AuthService) { }


// attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato
// metodo per concatenare il token nei metodi di chiamata al server
getAuthHeader(): HttpHeaders {
  let headers = new HttpHeaders(
    {
      Autorization: 'Bearer ' + this.auth.getToken()
    }
  );
  return headers;
}


getManifestazioni() {

  // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

  // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

      // primo metodo passando il token in chiaro su url
      //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

      // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
       return this.http.get(this.APIURL,  {
         headers: this.getAuthHeader()
       });      // ok


     /*
      return this.http.get(this.APIURL).subscribe(
        data => console.log(data),
        error => alert(error.message)
      );

  */

      }

      getManifestazione(id: number) {
        return this.http.get(this.APIURL + '/' + id, {
          headers: this.getAuthHeader()
        });
      }


      deleteManifestazione(manif: Manifestazione) {
        return this.http.delete(this.APIURL + '/' + manif.id,  {
          headers: this.getAuthHeader()
        });

      }



  updateManifestazione(manif: Manifestazione) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    manif['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + manif.id, manif,  {
      headers: this.getAuthHeader()
    });

  }


   createManifestazione(manif: Manifestazione){
    return this.http.post(this.APIURL, manif,  {
      headers: this.getAuthHeader()
    });
  }

  

  getLastManifestazioneid() {

    return this.http.get(this.APIURLLAST + this.rootManiflastid ,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

  getManifbyStato(stato: number) {

    // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header

       

//alert('GiornataService - Parametri: ' + tipoRic + ' tipo filtro: ' + this.tipoFiltro);

        this.APIURLSEARCH = environment.APIURL + this.rotta + this.rootRicercaStato;

        if(stato === 9) {
          return this.http.get(this.APIURL,  {
            headers: this.getAuthHeader()
          });      
        } else {
          return this.http.get(this.APIURLSEARCH + stato,  {
            headers: this.getAuthHeader()
          });      // ok;
        }
}

}
