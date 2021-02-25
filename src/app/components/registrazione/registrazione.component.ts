import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../classes/User';
import { JwtInterface } from '../../interfaces/jwt';
import { AuthService } from './../../services/auth.service';
import { faEnvelope, faEyeSlash,  faEye,  faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {

  // isone
  faEnvelope = faEnvelope;
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  faUser = faUser;

  fieldTextType: boolean;
  // variabili varie
  password: string = '';
  toggle1: boolean = false;
  toggle2: boolean = false;
  // campi per gestione messaggio utente
  public alertSuccess = false;
  public savechange = false;
  public message = '';

  private user: User;

  constructor(private  auth: AuthService, private router: Router) {

   }


  ngOnInit(): void {
  }


  async Registrazione(form: NgForm) {
    if(!form.valid) {
     return false;
   }

   // const resp = await this.auth.signIn(form.value.email, form.value.password).toPromise();
   //   alert('login corretto per utente:  ' + resp.user_name);
   //   this.router.navigate(['/']);

      alert('Registrazione:  sono pronto per registrare ' + form.value.cognome);


       await this.auth.signUp(form.value.cognome, form.value.username, form.value.password).subscribe(
        response => {
              alert('Registrazione corretta per utente:  ' + response.cognome);
              this.message = 'Registrazione corretta per utente:  ' + response.cognome;
              this.savechange = true;
              this.alertSuccess = true;
                   // provvisoriamente non faccio visualizzazione immediata elenco
         //   this.router.navigate(['/']);
       },
    error => {
        this.alertSuccess = false;
        this.savechange = true;
        console.log(error.message);
    //  alert('chgpwd - errore getUserLong da auth ----->  ' + e);
        switch (error.message)  {
          case 401:
           // alert(e.error.error);
            this.message = 'errore 401 - utente non riconosciuto';
            break;
          case 402:
           // alert(e.statusText);
           this.message = 'errore 402 ';
           break;
           case 403:
            // alert(e.statusText);
            this.message = 'errore 403 ';
            break;
            case 404:
            //alert(e.header.message);
            this.message = 'errore 404 - Non trovato';
            break;
            case 500:
            //alert('errore 500 - contattare il server');
            this.message = 'errore 500 - contattare il server';
            break;
            default:
              this.message = 'errore ' + error.message;
              break;
       }

   });

  }

/*
     da buttare
  // -------------
  signUp(form: NgForm) {
    if(!form.valid) {
     return false;
   }  else {
     alert('Registrazione - sono in SignUp');


     const resp = await this.auth.signIn(form.value.username, form.value.password);
     if(resp){
       alert('login corretto per utente:  ' + resp.username);
       this.message = 'login corretto per utente:  ' + resp.username;
       this.savechange = true;
       this.alertSuccess = true;
     }
       // provvisoriamente non faccio visualizzazione immediata elenco
       this.router.navigate(['/']);
  } catch (e) {
       this.alertSuccess = false;
       this.savechange = true;
       console.log(e);
   //  alert('chgpwd - errore getUserLong da auth ----->  ' + e);
       switch (e.status)  {
         case 401:
          // alert(e.error.error);
           this.message = 'errore 401 - utente non riconosciuto';
           break;
         case 402:
          // alert(e.statusText);
          this.message = 'errore 402 ';
          break;
          case 403:
           // alert(e.statusText);
           this.message = 'errore 403 ';
           break;
           case 404:
           //alert(e.header.message);
           this.message = 'errore 404 - Non trovato';
           break;
           case 500:
           //alert('errore 500 - contattare il server');
           this.message = 'errore 500 - contattare il server';
           break;
           default:
             this.message = 'errore ' + e.status + ' ' + e.error.error;
             break;
      }






     // -------------

     this.auth.signUp(form.value.cognome, form.value.username, form.value.password)
     .subscribe(resp =>{
         alert(resp.username + ' Registrato correttamente');
        // this.router.navigate(['/']);
     },
       ({error}) =>{
          alert(error.error)
       }
     )


   }

  }

  */

// non funziona lo switch tra password visibile e a pallini
toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}



}
