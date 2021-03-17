import { Injectable } from '@angular/core';
import { Giornata } from './../classes/Giornata';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GiornataService {

 // lettura dati da server Sifapi
 giornata: Giornata[] = [];  // definisco i dati come array vuoto

 private rotta = "/giornata";
 private rottadayActive = '/giornataact';
 private rottaManif = '/giornataManif';
 
 private rootGiornatalastid  = "/lastid";

 private rootGiornatebyManif = '/getGiornateByManifId/';
 private rootGiornatebyManifFiltro  = '/getGiornateByManifIdFiltrato/';
 private rootGirnataactive = '/getGiornataactive/';
 private rootlastGiornatabyManif = '/getLastGiornataByManifId/';

 

 private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
 private APIURLACT = environment.APIURL + this.rottadayActive + this.rootGirnataactive;
 private APIURLLAST = environment.APIURL + this.rottaManif;



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


getGiornate() {

  // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

  // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

      // primo metodo passando il token in chiaro su url
      //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

      // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
       return this.http.get(this.APIURL,  {
        headers: this.getAuthHeader()
      });      // ok;      // ok

    }

      getGiornata(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteGiornata(giornata: Giornata) {
        return this.http.delete(this.APIURL + '/' + giornata.id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }



  updateGiornata(giornata: Giornata) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    giornata['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + giornata.id, giornata,  {
      headers: this.getAuthHeader()
    });      // ok;

  }


   createGiornata(giornata: Giornata){
    return this.http.post(this.APIURL, giornata,  {
      headers: this.getAuthHeader()
    });      // ok;
  }


  getGiornateforManif(id: number, tipoRic: string) {

    // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header

        this.tipoFiltro = 0;
        switch (tipoRic) {
          case 'T':
              break;
         case 'A':
             this.tipoFiltro = 1;
             break;
         case 'C':
             this.tipoFiltro = 2;
             break;
         case 'E':
             this.tipoFiltro = 3;
             break;
         case 'N':
              this.tipoFiltro = 0;
              break;
         default:
             tipoRic = 'T';
             break;
         }

//alert('GiornataService - Parametri: ' + tipoRic + ' tipo filtro: ' + this.tipoFiltro);




        if(tipoRic == 'T') {
          return this.http.get(this.APIURL + this.rootGiornatebyManif + id,  {
            headers: this.getAuthHeader()
          });      // ok;
        } else {
          return this.http.get(this.APIURL + this.rootGiornatebyManifFiltro + id + '/tipo/' + this.tipoFiltro,  {
            headers: this.getAuthHeader()
          });      // ok;
        }


}


getGiornataactive()  {

return this.http.get(this.APIURLACT,  {
  headers: this.getAuthHeader()
});      // ok;      // ok  // ok;

}


getLastGiornataid() {

  this.APIURLLAST = environment.APIURL + this.rottaManif + this.rootGiornatalastid;

  return this.http.get(this.APIURLLAST ,  {
    headers: this.getAuthHeader()
  });      // ok;

}

getLastGiornataidbyManif(id: number) {

  this.APIURLLAST = environment.APIURL + this.rotta + this.rootlastGiornatabyManif  + id;



  return this.http.get(this.APIURLLAST  ,  {
    headers: this.getAuthHeader()
  });      // ok;

}


}
