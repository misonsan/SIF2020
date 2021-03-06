import { Injectable } from '@angular/core';
import { Commandawriga } from '../classes/Commandawriga';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class CommandawrigaService {
 // lettura dati da server Sifapi
 commandawriga: Commandawriga[] = [];  // definisco i dati come array vuoto

 private rotta = "/commandawriga";
 private rottaord = '/commandawrigaord';
 private rottatipo = '/commandawrigatipo';

 private rootProdottibyTipologia = '/getProdottiforTipologia/';
 private rootProdottiOrdinati = '/getProdottiOrdinati/';

 private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
 private APIURLTipo = environment.APIURL + this.rottatipo + this.rootProdottibyTipologia;
 private APIURLOrd = environment.APIURL + this.rottaord + this.rootProdottiOrdinati;

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


getCommandewrighe() {

  // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

  // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

      // primo metodo passando il token in chiaro su url
      //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

      // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
       return this.http.get(this.APIURL,  {
        headers: this.getAuthHeader()
      });      // ok;      // ok


   }

      getCommandawriga(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteCommandawriga(id) {
        return this.http.delete(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }



  updateCommandawriga(commandawriga: Commandawriga) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    commandawriga['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + commandawriga.id, commandawriga,  {
      headers: this.getAuthHeader()
    });      // ok;

  }


   createCommandawriga(commandawriga: Commandawriga){
    return this.http.post(this.APIURL, commandawriga,  {
      headers: this.getAuthHeader()
    });      // ok
  }

  getProdottiforTipologia(tipo: number) {

    // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header


         // return this.http.get(this.APIURL + this.rootProdottibyRuolo + ruolo);

          return this.http.get(this.APIURLTipo + tipo,  {
            headers: this.getAuthHeader()
          });      // ok;

        }

        getProdottiOrdinati(idCommanda: number) {

          return this.http.get(this.APIURLOrd + idCommanda,  {
            headers: this.getAuthHeader()
          });      // ok;

        }

}
