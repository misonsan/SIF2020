import { Injectable } from '@angular/core';
import { Commanda } from './../classes/Commanda';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommandaService {

 // lettura dati da server Sifapi
 commanda: Commanda[] = [];  // definisco i dati come array vuoto

 private rotta = "/commanda";
 private rootCommandabyGiornata = '/getCommandeByGiornataId/';
 private rootCommandabyGiornataFiltro  = '/getCommandeByGiornataIdFiltrato/';
 private rootCommandaByGiornataeCompetenza  = '/getCommandeByGiornataeCompetenza/';
 private rootCommandaByGiornataeCompetenzaestato  = '/getCommandeByGiornataeCompetenzaestato/';
 private rootdelete = '/commandadlt/deleteAll'

 private rottaLast = "/commandalast";
 private rootCommandalastid  = '/lastid/';


 private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

 private APIURLLAST = environment.APIURL + this.rottaLast;
 private APIURLDLT = environment.APIURL + this.rootdelete;  // al momento non funziona
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

getCommande() {

  // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

  // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

      // primo metodo passando il token in chiaro su url
      //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

      // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
       return this.http.get(this.APIURL,  {
            headers: this.getAuthHeader()
          });      // ok
    }

      getCommanda(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteCommanda(commanda: Commanda) {
        return this.http.delete(this.APIURL + '/' + commanda.id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }



  updateCommanda(commanda: Commanda) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    commanda['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + commanda.id, commanda,  {
            headers: this.getAuthHeader()
          });      // ok;

  }


   createCommanda(commanda: Commanda){
    return this.http.post(this.APIURL, commanda,  {
          headers: this.getAuthHeader()
        });      // ok;
  }




  getCommandeforGiornataFiltro(id: number, tipoRic: number) {

        const xx = this.APIURL + this.rootCommandabyGiornataFiltro + id + '/tipo/' + tipoRic;
     //      alert('commandaService - root:' + xx);
          return this.http.get(this.APIURL + this.rootCommandabyGiornataFiltro + id + '/tipo/' + tipoRic,  {
            headers: this.getAuthHeader()
          });      // ok;
   }


getCommandeforGiornata(id: number) {

  return this.http.get(this.APIURL + this.rootCommandabyGiornata + id,  {
        headers: this.getAuthHeader()
      });      // ok;

}

getLastCommandaid() {

  return this.http.get(this.APIURLLAST + this.rootCommandalastid ,  {
    headers: this.getAuthHeader()
  });      // ok;

}

getCommandeforGiornataeCompetenza(id: number, comp: number) {

 // const xx = this.APIURL + this.rootCommandaByGiornataeCompetenza + id + '/comp/' + comp;
//      alert('commandaService - root:' + xx);
    return this.http.get(this.APIURL + this.rootCommandaByGiornataeCompetenza + id + '/comp/' + comp,  {
      headers: this.getAuthHeader()
    });      // ok;
}

getCommandeforGiornataeCompetenzaestato(id: number, comp: number, stato: number) {

  // const xx = this.APIURL + this.rootCommandaByGiornataeCompetenza + id + '/comp/' + comp;
 //      alert('commandaService - root:' + xx);
     return this.http.get(this.APIURL + this.rootCommandaByGiornataeCompetenzaestato + id + '/comp/' + comp + '/stato/' + stato,  {
       headers: this.getAuthHeader()
     });      // ok;
 }


 // al momento da errore di incompatibilità di metodo
 deleteAll() {

  return this.http.get(this.APIURLDLT ,  {
    headers: this.getAuthHeader()
  });      // ok;
 }

}
