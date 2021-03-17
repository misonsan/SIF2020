import { Injectable } from '@angular/core';
import { Cassaw } from './../classes/Cassaw';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CassawService {

   // lettura dati da server Sifapi
 cassaw: Cassaw;

 private rotta = "/cassaw";
 private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
 

  constructor(private http: HttpClient, 
              private auth: AuthService) { }

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

      getCassa(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteCassa(cassaw: Cassaw) {
        return this.http.delete(this.APIURL + '/' + cassaw.id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }



  updateCassa(cassaw: Cassaw) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    cassaw['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + cassaw.id, cassaw,  {
      headers: this.getAuthHeader()
    });      // ok;

  }


   createCassa(cassaw: Cassaw){
    return this.http.post(this.APIURL, cassaw,  {
      headers: this.getAuthHeader()
    });      // ok;
  }

}
