import { Injectable } from '@angular/core';
import { TabellatwDett } from './../classes/tabella_tw_dett';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TabellaTwDettService {

  tabellatwdett: TabellatwDett;

  private rotta = "/tabellatwdett";
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
 
 
   getelTabelle() {
 
     // ritorniamo un observoble - il subscribe devo farlo su users.component.ts
   
     // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati
   
         // primo metodo passando il token in chiaro su url
         //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url
   
         // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
          return this.http.get(this.APIURL,  {
               headers: this.getAuthHeader()
             });      // ok
       }
   
 
 
       getelTabella(id: number) {
         return this.http.get(this.APIURL + '/' + id,  {
           headers: this.getAuthHeader()
         });      // ok;
       }
 
 
       deleteelTabella(tabellatwdett: TabellatwDett) {
         return this.http.delete(this.APIURL + '/' + tabellatwdett.id,  {
           headers: this.getAuthHeader()
         });      // ok;
 
       }
 
 
 
   updateelTabella(tabellatwdett: TabellatwDett) {
 
     // imposto il metodo put pervhè laravel non gestisce e devo utilizzare il post per camuffare
     //
     //   return this.http.patch(this.APIURL + '/' + user.id,user);
     tabellatwdett['_method'] = 'PUT';
 
     return this.http.patch(this.APIURL + '/' + tabellatwdett.id, tabellatwdett,  {
       headers: this.getAuthHeader()
     });      // ok;
 
   }
 
 
    createelTabella(tabellatwdett: TabellatwDett){
     return this.http.post(this.APIURL, tabellatwdett,  {
       headers: this.getAuthHeader()
     });      // ok;
   }

}
