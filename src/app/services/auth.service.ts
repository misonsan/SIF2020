
import {HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable, Output, EventEmitter} from '@angular/core';
import { User } from '../classes/User';
import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

import { JwtInterface } from './../interfaces/jwt';

/*
export interface Jwt {
// definisco l'interfaccia dei dati che ottengo dalla chiamata di login
  access_token: string;
  token_type: string;
  expires_in: number;
// parametri aggiuntivi - vedi AuthController in laraapi
  cognome: string;
  username: string;
  password: string;
}  */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isUserLogged = true;

  // emettiamo degli eventi (la auth.service) che potranno essere ascoltati su altri componenti
  @Output() usersignedin = new EventEmitter<User>();
  @Output() usersignedup = new EventEmitter<User>();
  @Output() userlogout = new EventEmitter();
  @Output() userchgpwd = new EventEmitter<User>();

  // private APIAUTHURL = 'http://localhost:8000/api/auth/';  // definisco l'url su cui effettuare la lettura sul server  --- originale

  private APIAUTHURL = environment.APIAUTURL;  // definisco l'url su cui effettuare la lettura sul server
  private func = '';

  constructor(private http: HttpClient) {
  }

  isUserLoggedIn() {           // ---- ok
    // faccio la verifica se l'utente è loggato
    // con !! (doppia negazione) trasformiamo in booleano il risultato della verifica su localStorage
    this.isUserLogged = !!localStorage.getItem('token');
    return this.isUserLogged;

  }



//  versione 2 - sposto il subscribe nel componente che chiama il service
 async signIn(username: string, password: string): Promise<JwtInterface> {

  // ok test
   //alert('auth-service -- signIn: - username: ' + username + ' --  password: ' + password);
   // localStorage.setItem('userLogged', username);
   // localStorage.setItem('token', username);    // provvisorio sarà modificato dal valore token dopo lettura backoffice
  //  return;
  // fine test


    return this.http.post(this.APIAUTHURL + 'login',
      {
        username,
        password
      }
    ).pipe(
      tap(
        (payload: JwtInterface) => {
          localStorage.setItem('token', payload.access_token);
          console.log(payload);
          localStorage.setItem('user', JSON.stringify(payload));            // campi aggiuntivi messi per testare - facoltativi
          localStorage.setItem('username', payload.username);
          localStorage.setItem('cognome', payload.cognome);
          localStorage.setItem('email', payload.email);
          localStorage.setItem('user_ruolo', payload.level);
          localStorage.setItem('id', String(payload.id));

          const user = new User();
          user.cognome = payload.cognome;
          user.username = payload.username;
          user.idRuolo_Day = parseInt(payload.level, 10);
          this.usersignedin.emit(user);
          return true;

        }
      )).toPromise();


  }




// Secondo metodo -

  signUp(cognome: string, username: string, password: string) {   // ----- ok
    // metodo per la registrazione dell 'utente

    //  test
   //  alert('auth-service -- SignUp - username: ' + username + ' --  password: ' + password) + ' --  cognome: ' + cognome;
   //  localStorage.setItem('userLogged', username);
   //  localStorage.setItem('cognome', cognome);    // provvisorio sarà modificato dal valore token dopo lettura backoffice
   //  localStorage.setItem('password', password);
   //  return;
     // fine test








    alert('auth-signup : ' + this.APIAUTHURL + 'signup');




    return this.http.post(this.APIAUTHURL + 'signup',
      {
        cognome,
        username,
        password

      }).pipe(
      tap(
        (payload: JwtInterface) => {   // payload variabile che identifica risposta del server

          localStorage.setItem('token', payload.access_token);
          console.log(payload);
          localStorage.setItem('user', JSON.stringify(payload));
          // campi aggiuntivi messi per testare - facoltativi
          localStorage.setItem('username', payload.username);
          localStorage.setItem('cognome', payload.cognome);
          localStorage.setItem('user_ruolo', payload.level);
          localStorage.setItem('id', String(payload.id));

          const user = new User();
          user.username = username;
          user.cognome = cognome;
          user.password = password;
          user.idRuolo_Day = parseInt(payload.level, 10);
          this.usersignedup.emit(user);
          return true;  // provvisorio
        },
        (httpResp: HttpErrorResponse) => {

          alert(httpResp.message);
        }
      ));

  }





/*      da  sistemare
  async chgpwd(username: string, emailx: string, newpassword: string): Promise<boolean> {
    const headers = new HttpHeaders(
      {
        Authorization: 'Bearer ' +  this.getToken()
      }
    );
    const utente = new Utente();
    utente.cognome = username;
    user.email = emailx;
    user.password = newpassword;


    this.func = 'chgpwd';
    // return this.http.post<boolean>(this.APIAUTHURL + 'chgpwd', user, {headers}).toPromise();    originale

    return this.http.post<boolean>(this.APIAUTHURL + 'chgpwd', user, {headers}).pipe(
      tap(
        (payload: boolean) => {

          localStorage.setItem('Func', this.func);
          const user = new User();
          user.name = username;
          user.email = emailx;
          this.userchgpwd.emit(user);
          return true;

        }
      )).toPromise();

  }
 */

  logout() {   // ------  ok
    localStorage.removeItem('token');
    // devo eliminare tutte le eventuali variabili salvate su localStorage
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('cognome');
    localStorage.removeItem('user_ruolo');
    localStorage.removeItem('email');
 
    this.userlogout.emit();
    this.isUserLogged = false;
  }


  getUtente(): User {     // ----- ok
    // salvo su una variabile i dati dell'utente salvati in localStorage
    const data = JSON.parse(localStorage.getItem('user'));  // normalizzo la variabile user salvata con JSON.stringify
    const user = new User();
    if (data) {
      user.username = data.username;
      user.cognome = data.cognome;
      user.idRuolo_Day = parseInt(data.level, 10);
    }
    return user;
  }

  getToken() {    // -----  ok
    return localStorage.getItem('token');
  }


// metodo creato da Moreno per gestire lettura con Username, email e password attuale (changepwd)
// tslint:disable-next-line:typedef
  async getUserLong(username: string, cognome: string, password: string): Promise<JwtInterface> {   // ----- ok
    // metodo per la registrazione dell 'utente


   //  return this.signIn(emailx, passwordOld);   // originaria di hidran
   this.func = 'getUserLong';

   return this.http.post(this.APIAUTHURL + 'getUserLong',
      {
        username,
        cognome,
        password
      }
    ).pipe(
      tap(
        (payload: JwtInterface) => {
          localStorage.setItem('token', payload.access_token);
          console.log(payload);
          localStorage.setItem('user', JSON.stringify(payload));            // campi aggiuntivi messi per testare - facoltativi
          localStorage.setItem('username', payload.username);
          localStorage.setItem('cognome', payload.cognome);
          localStorage.setItem('user_ruolo', payload.level);
          localStorage.setItem('Func', this.func);
          const user = new User();
          user.username = payload.username;
          user.cognome = payload.cognome;
          this.usersignedin.emit(user);
          return true;

        }
      )).toPromise();
  }



//  versione 1   con subscribe fatta nel service
  /*
  signIn(email: string, password: string) {
    // metodo con il quale l'utente si logga
    // alert(' auth-service: '  + email + ' -- ' + password);

    // salvo in localstorage, come token' la email per indicare che mi sono loggato


      localStorage.clear();
      this.http.post(this.APIAUTHURL + 'login',
            {
              email: email,
              password: password
            }).subscribe(
              (payload: Jwt) => {   // payload variabile che identifica risposta del server

                localStorage.setItem('token', payload.access_token);
                console.log(payload)
                localStorage.setItem('user', JSON.stringify(payload));
                // campi aggiuntivi messi per testare - facoltativi
                localStorage.setItem('user_name', payload.user_name);
                localStorage.setItem('user_email', payload.email);
                localStorage.setItem('user_psw', payload.password);

                // creo l'evento che sarà gestito da altri componenti
                let user = new User();
                user.name = payload.user_name;
                user.email =  payload.email;
                this.usersignedin.emit(user);
                return true;  // provvisorio

              },
                (httpresp: HttpErrorResponse)  => {
                 console.log(httpresp.message);
                  alert('AuthService-login_Error: ' + httpresp.message);
               }
            )

  }
  */

// primo metodo - funziona
  /*
  signUp(username: string, email: string, password: string) {   // ----- ok
    // metodo per la registrazione dell 'utente

      const user = new User();
      user.name = username;
      user.email =  email;

      this.http.post(this.APIAUTHURL + 'signup',
          {
            email: email,
            password: password,
            name: username
          }).subscribe(
            (payload: Jwt) => {   // payload variabile che identifica risposta del server

              localStorage.setItem('token', payload.access_token);
              console.log(payload);
              localStorage.setItem('user', JSON.stringify(payload));
              // campi aggiuntivi messi per testare - facoltativi
              localStorage.setItem('user_name', payload.user_name);
              localStorage.setItem('user_email', payload.email);
              localStorage.setItem('user_psw', payload.password);

              this.usersignedup.emit(user);
              return true;  // provvisorio

            },
              (httpresp: HttpErrorResponse)  => {
               console.log(httpresp.message);
                alert('AuthService-signup: ------> ' + httpresp.message);
             })

  }
    */



}


