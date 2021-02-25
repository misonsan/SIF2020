import { Injectable } from '@angular/core';
import { Moneypay } from './../classes/Moneypay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MoneypayService {

 // lettura dati da server Sifapi
 moneypays: Moneypay[] = [];  // definisco i dati come array vuoto
 moneypay: Moneypay;

 private rotta = "/moneypay";

 private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

 constructor(private http: HttpClient, private auth: AuthService) { }

// attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato


// Route::get('commandariga/commandarigaprodco/{id}' , 'App\Http\Controllers\CommandarigaController@getProdottiforCommanda');


 private rootMoneypaybyCommanda = '/getMoneyforCommanda/';


getAuthHeader(): HttpHeaders   {
  // passo il token dentro a header per non farlo passare in chiaro su url

  const headers = new HttpHeaders(
      {
          Authorization: 'Bearer ' +  this.auth.getToken()
      }
    );
    return headers;
  }



      getMoneypay(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteMoneypayw(moneypay: Moneypay) {
        return this.http.delete(this.APIURL + '/' + moneypay.id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }

  updateMoneypay(moneypay: Moneypay) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    moneypay['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + moneypay.id, moneypay,  {
      headers: this.getAuthHeader()
    });      // ok;

  }

   createMoneypay(moneypay: Moneypay){
    return this.http.post(this.APIURL, moneypay,  {
      headers: this.getAuthHeader()
    });      // ok;
  }

  getMoneypayforCommanda(id: number) {

    return this.http.get(this.APIURL + this.rootMoneypaybyCommanda + id,  {
          headers: this.getAuthHeader()
        });      // ok;

  }





}
