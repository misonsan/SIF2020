import { Injectable } from '@angular/core';
import { Moneyw } from './../classes/Moneyw';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MoneywService {

 // lettura dati da server Sifapi
 moneyw: Moneyw[] = [];  // definisco i dati come array vuoto

 private rotta = "/moneyw";

 private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

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



      getMoneyw(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteMoneyw(moneyw: Moneyw) {
        return this.http.delete(this.APIURL + '/' + moneyw.id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }

  updateMoneyw(moneyw: Moneyw) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    moneyw['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + moneyw.id, moneyw,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

   createMoneyw(moneyw: Moneyw){
    return this.http.post(this.APIURL, moneyw,  {
      headers: this.getAuthHeader()
    });      // ok;
  }


}
