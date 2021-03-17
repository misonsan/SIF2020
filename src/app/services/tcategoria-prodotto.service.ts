import { Injectable } from '@angular/core';
import { TcategoriaProdotto } from './../classes/T_categoria_prodotto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TcategoriaProdottoService {


 tcategoriaProdotti: TcategoriaProdotto[] = [];
 tcategoriaProdotto: TcategoriaProdotto;

 private rotta = "/tcategoriaprod";
 
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

getCategorie() {

  // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

  // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

      // primo metodo passando il token in chiaro su url
      //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

      // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
       return this.http.get(this.APIURL,  {
            headers: this.getAuthHeader()
          });      // ok
    }

      getCategoria(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok;
      }


      deleteCategoria(tcategoriaProdotto: TcategoriaProdotto) {
        return this.http.delete(this.APIURL + '/' + tcategoriaProdotto.id,  {
          headers: this.getAuthHeader()
        });      // ok;

      }

  updateCategoria(tcategoriaProdotto: TcategoriaProdotto) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    tcategoriaProdotto['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + tcategoriaProdotto.id, tcategoriaProdotto,  {
            headers: this.getAuthHeader()
          });      // ok;
  }

   createCategoria(tcategoriaProdotto: TcategoriaProdotto){
    return this.http.post(this.APIURL, tcategoriaProdotto,  {
          headers: this.getAuthHeader()
        });      // ok;
  }

  getLastid() {

    return this.http.get(this.APIURLLAST,  {
      headers: this.getAuthHeader()
    });      // ok;
  
  }
  
}
