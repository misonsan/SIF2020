import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import { PersonaService }  from '../../services/persona.service'; // ./../../services/fedele.service
import { Persona } from '../../classes/Persona';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-persone',
  templateUrl: './persone.component.html',
  styleUrls: ['./persone.component.css']
})
export class PersoneComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public users: Persona[] = [];
  @Output('updateUser') updateUser = new EventEmitter<Persona>();

  public title = "elenco Persone per Servizio";
  public Message = '';
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public ruolo = 0;
  public ruoloEnd = 0;

 options = [
    'Tutte',
    'Non Assegnato',
    'Con Ruolo',
    'Non Operativo'
  ];

  // per paginazone
  p: number = 1;

   // variabili per visualizzazione messaggio di esito con notifier
   public type = '';
   public message = '';

  constructor(private personaService: PersonaService,
              private router: Router) {
            
              }


ngOnInit(): void {

  //this.isVisible = false;
  this.tipoRichiesta = 'Tutte';
  this.loadPersone();
}

async loadPersone() {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.personaService.getPersone().subscribe(
       res => {
          this.users = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Persone  -- loadPersone - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}


async loadPersoneconRuolo1(ruolo: number) {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.personaService.getPersoneforRuolo1(ruolo).subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
          this.users = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Persone  -- loadPersone - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}


async loadPersoneconRuolo2(ruolo1: number, ruolo2: number) {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.personaService.getPersoneforRuolo2(ruolo1, ruolo2).subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
          this.users = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Persone  -- loadPersone - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}




// imposto il filtro di ricerca dei fedeli
onSelectionChange(tiruolo: string)   {


this.tipoRichiesta = tiruolo;  //tifedel.substring(0,1);
this.validSearch = true;

if(this.tipoRichiesta === '?') {
  this.validSearch = false;
  alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
  return;
  }  else {

        switch (this.tipoRichiesta) {
            case 'Tutte':
            this.loadPersone();
         //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
            break;
            case 'Non Assegnato':
              this.ruolo = 0;
              this.loadPersoneconRuolo1(this.ruolo);
              break;
            case 'Con Ruolo':
          //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
              this.ruolo = 0;
              this.ruoloEnd = 90;
              this.loadPersoneconRuolo2(this.ruolo, this.ruoloEnd);
               break;
            case 'Non Operativo':
              this.ruolo = 99;
              this.loadPersoneconRuolo1(this.ruolo);
              break;
            default:
            alert('Scelta errata \n ricerca non possibile');
            break;
      }
    }


}


/*

ricercaPersone() {

  alert(' da controllare');
 // return;

// il campo messa.id è  del record presente this.messa.id


      if(this.tipoRichiesta == '?') {
      this.validSearch = false;
      alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
      return;
      }  else {

            switch (this.tipoRichiesta) {
                case 'Tutte':
                this.loadPersone();
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                break;
                case 'Non Assegnato':
                  this.ruolo = 0;
                  this.loadPersoneconRuolo1(this.ruolo);
                  break;
                case 'Con Ruolo':
              //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                  this.ruolo = 0;
                  this.ruoloEnd = 90;
                  this.loadPersoneconRuolo2(this.ruolo, this.ruoloEnd);
                   break;
                case 'Non Operativo':
                  this.ruolo = 99;
                  this.loadPersoneconRuolo1(this.ruolo);
                  break;
                default:
                alert('Scelta errata \n ricerca non possibile');
                break;
          }
        }
    }
    */
    

    onSelectUser(persona: Persona){

      this.updateUser.emit(persona);

     }



  }
