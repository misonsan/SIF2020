import { Injectable } from '@angular/core';
import { Persona } from '../classes/Persona';
//import { HttpClientModule } from '@angular/common/http';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  persone: Persona[] = [];  // definisco i dati come array vuoto

private rotta = "/persone";
private rottaactive = "/personeact";

// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

private APIURLSELECT = environment.APIURL;

private rootPersoneforRuolo = '/getpersoneforRuolo/';
private rootPersoneforRuoloFiltro  = '/getpersoneforRuoloFiltrato/';

private rootPersonebyRuoloFiltro  = '/getpersonebyRuoloFiltrato/';
private rootPersoneActive  = '/getpersoneActive/';



//private rootPersonebyRuolo1 = '/getpersoneforRuolo1/';    via  eliminare
//private rootPersonebyRuolo2  = '/getpersoneforRuolo2/';   via  buttare

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


getPersone() {

  // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

  // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

      // primo metodo passando il token in chiaro su url
      //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

      // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
       return this.http.get(this.APIURL,  {
        headers: this.getAuthHeader()
      });      // ok      // ok


      }

      getPersona(id: number) {
        return this.http.get(this.APIURL + '/' + id,  {
          headers: this.getAuthHeader()
        });      // ok
      }


      deletePersona(persona: Persona) {
        return this.http.delete(this.APIURL + '/' + persona.id,  {
          headers: this.getAuthHeader()
        });      // ok

      }



  updatePersona(persona: Persona) {

    // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
    //
    //   return this.http.patch(this.APIURL + '/' + user.id,user);
    persona['_method'] = 'PUT';

    return this.http.patch(this.APIURL + '/' + persona.id, persona,  {
      headers: this.getAuthHeader()
    });      // ok

  }


   createPersona(persona: Persona){
    return this.http.post(this.APIURL, persona,  {
      headers: this.getAuthHeader()
    });      // ok
  }


  getPersoneforRuolo1(ruolo: number) {

    // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header


         // return this.http.get(this.APIURL + this.rootPersonebyRuolo + ruolo);
          return this.http.get(this.APIURL + this.rootPersoneforRuolo + ruolo,  {
            headers: this.getAuthHeader()
          });      // ok

        }


 getPersoneforRuolo2(ruolo1: number, ruolo2: number) {



         // return this.http.get(this.APIURL + this.rootPersoneforRuoloFiltro + ruolo1 + '/ruolo/' + ruolo2);

          return this.http.get(this.APIURL + this.rootPersonebyRuoloFiltro + ruolo1,  {
            headers: this.getAuthHeader()
          });      // ok



        }


        getPersoneforRuoloFiltrato(ruolo1: number) {



          // return this.http.get(this.APIURL + this.rootPersoneforRuoloFiltro + ruolo1 + '/ruolo/' + ruolo2);

           return this.http.get(this.APIURL + this.rootPersonebyRuoloFiltro + ruolo1,  {
            headers: this.getAuthHeader()
          });      // ok



         }

         getpersoneActive() {
            return this.http.get(this.APIURLSELECT + this.rottaactive + this.rootPersoneActive,  {
            headers: this.getAuthHeader()
            });      // ok
         }


}
