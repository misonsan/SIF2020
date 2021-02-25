import { Injectable } from '@angular/core';
import { Prodotto } from '../classes/Prodotto';
//import { HttpClientModule } from '@angular/common/http';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ProdottoService {

  persone: Prodotto[] = [];  // definisco i dati come array vuoto

  private rotta = "/prodotto";
  // vecchia versione senza environment
  //  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  private rootProdottibyMenu = '/getProdottiforMenu/';
  private rootProdottibyTipologia = '/getProdottiforTipologia/';

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



  getProdotti() {

    // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
         return this.http.get(this.APIURL,  {
          headers: this.getAuthHeader()
        });      // ok      // ok      // ok

      }

        getProdotto(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

        deleteProdotto(prodotto: Prodotto) {
          return this.http.delete(this.APIURL + '/' + prodotto.id,  {
            headers: this.getAuthHeader()
          });      // ok      // ok

        }



    updateProdotto(prodotto: Prodotto) {

      // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
      //
      //   return this.http.patch(this.APIURL + '/' + user.id,user);
      prodotto['_method'] = 'PUT';

      return this.http.patch(this.APIURL + '/' + prodotto.id, prodotto,  {
        headers: this.getAuthHeader()
      });      // ok      // ok

    }


     createProdotto(prodotto: Prodotto){
      return this.http.post(this.APIURL, prodotto,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }


    getProdottiforMenu(menu: string) {

      // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

      // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

          // primo metodo passando il token in chiaro su url
          //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

          // secondo metodo passando il token non in chiaro come header


           // return this.http.get(this.APIURL + this.rootProdottibyRuolo + ruolo);
            return this.http.get(this.APIURL + this.rootProdottibyMenu + menu,  {
              headers: this.getAuthHeader()
            });      // ok      // ok

          }

          getProdottiforTipologia(tipo: number) {

            // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

            // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

                // primo metodo passando il token in chiaro su url
                //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

                // secondo metodo passando il token non in chiaro come header


                 // return this.http.get(this.APIURL + this.rootProdottibyRuolo + ruolo);
                  return this.http.get(this.APIURL + this.rootProdottibyTipologia + tipo,  {
                    headers: this.getAuthHeader()
                  });      // ok      // ok

                }
  }



