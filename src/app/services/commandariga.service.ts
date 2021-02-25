import { Injectable } from '@angular/core';
import { Commandariga } from '../classes/Commandariga';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommandarigaService {

  commandarighe: Commandariga[] = [];  // definisco i dati come array vuoto
  commandariga: Commandariga;

  private rotta = "/commandariga";
  private rottaLast = "/commandarigalast";
  private rootCommandarigalastid  = '/lastid/';

  private rottaProdotti = "/commandarigaprodco/";
  private rootCommandaforStatoSettore  = '/getProdottiforStatoSettore/';
  private rootprodottidaLavorare = '/getProdottidaLavorare/';
  private rootprodottiCucinadaConsegnare = '/getProdottiCucinadaConsegnare/';
  private rootprodottiBevandedaConsegnare = '/getProdottiBevandedaConsegnare/';
  private rootprodottiConsegnati = '/getProdottiConsegnati/';
  private rootAllprodotti = '/getAllProdotti/';
  private rootAllprodottiAct = '/getAllProdottiAct/'; 

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server


 private APIURLLAST = environment.APIURL + this.rottaLast;
 //private APIURLPRODC = environment.APIURL + this.rottaProdotti;

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


 getCommandarighe() {

   // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

   // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

       // primo metodo passando il token in chiaro su url
       //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

       // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
        return this.http.get(this.APIURL,  {
         headers: this.getAuthHeader()
       });      // ok;      // ok


    }

       getCommandariga(id: number) {
         return this.http.get(this.APIURL + '/' + id,  {
           headers: this.getAuthHeader()
         });      // ok;
       }


       deleteCommandariga(id) {
         return this.http.delete(this.APIURL + '/' + id,  {
           headers: this.getAuthHeader()
         });      // ok;

       }



   updateCommandariga(commandariga: Commandariga) {

     // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
     //
     //   return this.http.patch(this.APIURL + '/' + user.id,user);
     commandariga['_method'] = 'PUT';

     return this.http.patch(this.APIURL + '/' + commandariga.id, commandariga,  {
       headers: this.getAuthHeader()
     });      // ok;

   }


    createCommandariga(commandariga: Commandariga){
     return this.http.post(this.APIURL, commandariga,  {
       headers: this.getAuthHeader()
     });      // ok
   }

   getLastCommandarigaid() {

    return this.http.get(this.APIURLLAST + this.rootCommandarigalastid ,  {
      headers: this.getAuthHeader()
    });      // ok;

  }


  getProdottiforCommanda(id: number) {
    return this.http.get(this.APIURL + this.rottaProdotti + id ,  {
          headers: this.getAuthHeader()
        });      // ok;

  }


  getProdottiforStatoSettore(id: number, settore: number) {
    return this.http.get(this.APIURL + this.rootCommandaforStatoSettore + id + '/settore/' + settore,  {
          headers: this.getAuthHeader()
        });      // ok;

  }

  // ok provato e funziona
  getCommanderighedaLavorare(competenza: number, flagLav: number) {

    return this.http.get(this.APIURL + this.rootprodottidaLavorare + competenza + '/flagL/' + flagLav,  {
      headers: this.getAuthHeader()
    });      // ok;
  }

  // ok provato e funziona
  getProdottiCucinadaConsegnare(competenza: number, flagLav: number, flagCon: number ) {
    
    return this.http.get(this.APIURL + this.rootprodottiCucinadaConsegnare + competenza + '/flagL/' + flagLav + '/flagC/' + flagCon,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

  // ok provato e funziona
  getProdottiBevandedaConsegnare(competenza: number, flagCon: number) {

    return this.http.get(this.APIURL + this.rootprodottiBevandedaConsegnare + competenza  + '/flagC/' + flagCon,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

  getProdottiConsegnati(competenza: number, flagCon: number) {

    return this.http.get(this.APIURL + this.rootprodottiConsegnati + competenza  + '/flagC/' + flagCon,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

  getAllCommanderighe(competenza: number) {

    return this.http.get(this.APIURL + this.rootAllprodotti + competenza,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

  getAllCommanderigheAttive(competenza: number) {

    return this.http.get(this.APIURL + this.rootAllprodottiAct + competenza,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

  

}
