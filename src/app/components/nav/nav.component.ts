import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faUserPlus,faUserFriends, faPassport } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../classes/User';
import { AuthService } from './../../services/auth.service';
import { GiornataService } from './../../services/giornata.service';
import { Giornata } from './../../classes/Giornata';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Output() onNewUser = new EventEmitter();

  public isUserLoggedIn = false;
  faUserPlus = faUserPlus;
  faUserFriends = faUserFriends;

  public showMenu = true;    // variabile per impostare la visualizzazione della barra  - soluzione puro Angular

  public isCollapsed = true;  // variabile per soluzione con ngbootstrap
  public username: string;

  titolo = "Sanfra in Festa ....  ";
  anno = 2020;

  public isAbilityBevande = false;
  public isAbilityCucina = false;
  public isAbilityCassa = false;

  public user: User;
  public ruoloUser: number;
  public functionAdmin: number;
  public ruoloCassa = 1;
  public ruoloCucina = 2;
  public ruoloBevande = 3;
  public dayAbilitato = false;
  public giornata: Giornata;
  public idDay = 0;
  public funcEnabled = false;

  constructor(private route: Router, private auth: AuthService, private giornataService: GiornataService) {
    // ascolto evento creato in auth.service
    auth.usersignedin.subscribe(
        (user: User)  => {
            this.username = user.username;
            this.ruoloUser = user.idRuolo_Day;
            this.functionAdmin = parseInt(localStorage.getItem('user_ruolo'));
            this.isUserLoggedIn = true;
            // verifico se la giornata è attiva per gestione
            this.dayAbilitato = false;
            this.letturaseGiornataAttiva();
         /*
            this.abilityButton();

            this.isAbilityBevande = true;
        this.isAbilityCucina = true;
        this.isAbilityCassa = true;   */

          //  alert('nav-costruttore  ---------------------------------  login - ruolo: ' + user.idRuolo_Day);

        }
    );
// l'evento logout non ha come risultato un utente quindi lascio vuoto ()
    auth.userlogout.subscribe(
          ()  => {
              this.username = '';
              this.ruoloUser = 0;
              this.isUserLoggedIn = false;

          }
    );
     // per la registrazione ascolto evento creato in auth.service
    auth.usersignedup.subscribe(
          (user: User)  => {
                this.username = user.cognome;
                this.ruoloUser = user.idRuolo_Day;
                this.isUserLoggedIn = true;
      }
    );
    // per il cambio password ascolto evento creato in auth.service
    auth.userchgpwd.subscribe(
        (user: User)  => {
          this.username = user.cognome;
          this.ruoloUser = user.idRuolo_Day;
          this.isUserLoggedIn = true;
      }
  );

  //alert('nav-Costruttore ---------------------------   prima di abilityButton');
  // this.abilityButton();
 // alert('nav-Costruttore --------    fine ----------------   finito abilityButton');
  }

  ngOnInit() {

    var data = new Date()
    this.anno = data.getFullYear();
    

    this.isUserLoggedIn = this.auth.isUserLoggedIn();
    if(this.isUserLoggedIn)  {
      this.letturaseGiornataAttiva();
      const user = this.auth.getUtente();
      this.username = user.cognome;
      this.ruoloUser = user.idRuolo_Day;

      if(user.idRuolo_Day == -1) {
        this.funcEnabled = true;
      } else {
        this.funcEnabled = false;
      }




  //  ------    alert('nav-OnInit - ruolo: ' + this.ruoloUser);
      // recupero da localstorage il livello utente loggato
     // this.ruoloUser = parseInt(localStorage.getItem('user_ruolo'));
     // this.abilityButton();

    }
  }


/*

  abilityButton() {
      alert('abilityButton: ' + this.ruoloUser);
 /*   this.isAbilityBevande = false;
    this.isAbilityCucina = false;
    this.isAbilityCassa = false;


    switch (this.ruoloUser)  {
      case 1:
        alert('nav - identificato utente per Cassa');
        this.isAbilityCassa = true;
        break;
      case 2:
        alert('nav - identificato utente per Cucina');
        this.isAbilityCucina = true;
        break;
      case 3:
        alert('nav - identificato utente per Bevande');
        this.isAbilityBevande = true;
        break;
      case -1:
        alert('nav - identificato utente amministratore');
        this.isAbilityBevande = true;
        this.isAbilityCucina = true;
        this.isAbilityCassa = true;
        break;
      default:
        alert('nav - identificato utente Guest');
          break;
    }

  }
*/

async letturaseGiornataAttiva() {

  await   this.giornataService.getGiornataactive().subscribe(
            response => {
    // -----   alert('letto giornata attiva: ' + response['number'] ) ;
               if(response['number'] === 1) {
                 this.giornata = response['data'];
        //         alert('idGiornata: ' + this.giornata.id);
                 this.idDay = this.giornata.id;

        //         alert('idDay giornata attiva: ' + this.idDay ) ;
                 this.dayAbilitato = true;
          } else {
            this.dayAbilitato = false;
         }
     },
     error => {
        alert('nav  -- verificaseDayAbilitato - errore: ' + error.message);
        console.log(error);
     }
   )
}




 goActivity(ruolo: number) {

  if(this.dayAbilitato === false) {
    alert('Giornata non abilitata - Operatività non eseguibile');
    return;
  } else {
    this.lancioFunzioni(ruolo, this.idDay);
  }

}


   lancioFunzioni(ruolo: number, idDay: number) {

      // test
     // idDay = 1;
   // ------     alert('nav - lancioFunzioni +++++  Ruolo: --------> ' + ruolo);
        switch (ruolo)  {
          case 1:
  // ----          alert('nav - lancio la apertura Commande' + idDay);
           // vecchia modalità di uso cassa fino al 14/02/2021
           //  this.route.navigate(['commandeGiornata', idDay]);

            // vado direttamente alla creazione della commandaa  - dal 14/02/2021
            this.route.navigate(['commandaw/' +  idDay + '/new']);
           // this.route.navigate(['commandaw/' +  this.giornata.idManifestazione + '/new']);    // originale

            break;
          case 2:
          case 3:
            // this.route.navigate(['gestione/' +  idDay]);  // normale
            // test
            this.route.navigate(['gestione/' +  idDay]);
            break;
       /*
            case 3:
            // this.route.navigate(['gestione/'  +  idDay]);    // normale
             // test
             this.route.navigate(['gestionetest/' +  idDay]);
            break; */

          default:
            alert('nav - identificato utente Guest');
              break;
        }
  }

  newUser() {

    this.onNewUser.emit();
  }

  // se utilizziamo la soluzione di Angular Puro
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout(e) {   // la "e" è l'evento passato da html
    e.preventDefault()
    this.auth.logout();
    this.route.navigate(['login']);
    }

  login(email, pass) {
    this.auth.signIn(email, pass);
  }

  signIn(e) {
    e.preventDefault()
    this.route.navigate(['login']);
  }

  signUp(e) {
    e.preventDefault()
    this.route.navigate(['signup']);
  }


  chgpwd(e)  {
    e.preventDefault()
    this.route.navigate(['chgpwd']);
  }


  gofunctionAdminActivity(activity: string) {

    alert('nav ---- functionAdmin ----->' + this.functionAdmin);


    alert('attività richiesta: ' + activity);
    this.functionAdmin = parseInt(localStorage.getItem('user_ruolo'));
    if(this.functionAdmin != -1) {
      alert('Profilo utente non abilitato - Rivergersi all Amministratore');
      return;
    }
    switch (activity)  {
      case 'manif':
        this.route.navigate(['manif']);
       // this.route.navigate(['commandaw/' +  this.giornata.idManifestazione + '/new']);    // originale

          break;
        case 'commande':
           this.route.navigate(['commandeGiornata/' +  this.giornata.idManifestazione]);
           break;
      case 'giormanif':
           this.route.navigate(['giormanif/' +  this.giornata.idManifestazione]);
        // mettere link
        break;
      case 'prodotti':
        this.route.navigate(['prodotti']);
     // mettere link
       break;
      default:
        alert('nav - funzione non ancora attivata');
          break;
    }




  }









}
