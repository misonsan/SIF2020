import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../classes/User';
import { JwtInterface } from '../../interfaces/jwt';
import { AuthService } from './../../services/auth.service';
import { faEnvelope, faEyeSlash,  faEye,  faUser } from '@fortawesome/free-solid-svg-icons';

/*    cancellare
interface Jwt {
  // definisco l'interfaccia dei dati che ottengo dalla chiamata di login
      access_token: string;
      token_type: string;
      expires_in: number;
  // parametri aggiuntivi - vedi AuthController in laraapi
      user_name: string;
      email: string;
      password: string;
  }
*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

  ngOnInit() {
      // effettuiamo il redirect dopo aver fatto il login
      this.auth.usersignedin.subscribe(
        (user: User)  => {
                this.router.navigate(['/']);
         }
      );

  }

  // vertsione in cui sposto il subscribe nel componente e non nel service
  // prima versione   --- funziona
  /*
  signIn(form: NgForm) {
       if(!form.valid) {
        return false;
      }
       this.auth.signIn(form.value.email, form.value.password)
            .subscribe(
              (_payload: Jwt) => {
                 alert('login eseguito con successo');
                this.router.navigate(['/']);
              },
              ({error}) =>{
                alert(error.error);
                console.log(error)
              }
            );
    }  */





 // vertsione in cui sposto il subscribe nel componente e non nel service
  // seconda versione - Utilizzo di async-awai  (più performante con meno codice)

/*
  signIn(form: NgForm) {
    if(!form.valid) {
     return false;
   }  else {
     alert('login - sono in Signin');
     this.auth.signIn(form.value.username, form.value.password);

   }

  }

*/








  async signIn(form: NgForm) {
    if(!form.valid) {
     return false;
   }
    try {

   // const resp = await this.auth.signIn(form.value.email, form.value.password).toPromise();
   //   alert('login corretto per utente:  ' + resp.user_name);
   //   this.router.navigate(['/']);

      const resp = await this.auth.signIn(form.value.username, form.value.password);
      if(resp){
    //    alert('login corretto per utente:  ' + resp.username);
        this.message = 'login corretto per utente:  ' + resp.username;
        this.savechange = true;
        this.alertSuccess = true;
      }
        // provvisoriamente non faccio visualizzazione immediata elenco
        this.router.navigate(['home']);  //  this.router.navigate(['/']);
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

   }
  }




   changePassword() {

    const domanda = confirm("Sei sicuro di voler Cambiare la Password ?");
    if (domanda === true) {
      this.router.navigate(['chgpwd']);
         }else{
      alert('Operazione annullata');
    }

  }


// non funziona lo switch tra password visibile e a pallini
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }






/*
  changeType(input_field_password, num){
    if(input_field_password.type=="password")
      input_field_password.type = "text";
    else
      input_field_password.type = "password";

    if(num == 1)
      this.toggle1 = !this.toggle1;
    else
      this.toggle2 = !this.toggle2;
  }
*/
  /*
 visible = false;
 toggle(event){
     this.visible = !this.visible;
 }
*/
}

