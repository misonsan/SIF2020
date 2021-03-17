import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Persona } from '../../classes/Persona';

import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import { PersonaService }  from '../../services/persona.service'; // ./../../services/fedele.service




@Component({
  selector: 'app-giornata-detail-persone',
  templateUrl: './giornata-detail-persone.component.html',
  styleUrls: ['./giornata-detail-persone.component.css']
})
export class GiornataDetailPersoneComponent implements OnInit {

    // definizione delle icone utilizzate
    faSave = faSave;
    faUndo = faUndo;
    faHandPointLeft = faHandPointLeft;
    faTrashAlt = faTrashAlt;
    faInfoCircle = faInfoCircle;
    faThumbsUp = faThumbsUp;
    faThumbsDown = faThumbsDown;
    faPlusSquare = faPlusSquare;
    faSearch = faSearch;

// variabili per editazione messaggio
   public alertSuccess = false;
   public savechange = false;
   public isVisible = false;

   public textMessage1 = '';
   public textMessage2 = '';
   public textUser = '';
   public headerPopup = '';

 public title = 'situagione giornaliera Persone  -  giornata-detail-Persone works!';
 public manif: Manifestazione;
 public giornata: Giornata;


 public users: Persona[] = [];
 

  public title1 = "elenco Persone per Servizio";
  public Message = '';
  public trovatoRec = false;
  public nRec = 0;
  

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

 constructor(private router: Router,
              private route: ActivatedRoute,
              private manifService: ManifestazioneService,
              private giornataService: GiornataService,
              private personaService: PersonaService
               ) { }

ngOnInit(): void {
      this.giornata = new Giornata();
      this.route.paramMap.subscribe(p => {
      // -------  leggo i dati della giornata
      this.loadGiornata(+p.get('id'));
      this.loadPersone();
           // alert('GiornataDetailPersone - loadGiornata - finito OnInit');
      });
}
async loadGiornata(id: number) {
      //   alert('loadGiornata - id:' + id);
      await this.giornataService.getGiornata(id).subscribe(
      response => {
      this.giornata = response['data'];
       // leggo i dati della manifestazione
      this.loadManifestazione(this.giornata.idManifestazione);

      },
      error => {
      alert('Manif-Data  --loadGiornata: ' + error.message);
      console.log(error);
      }
    )

}


// recupero i dati della messa
async loadManifestazione(id: number) {
      // alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
      await  this.manifService.getManifestazione(id).subscribe(
      response => {
      this.manif = response['data'];
      },
      error => {
      alert('Manif-Data  --loadManifestazione: ' + error.message);
      console.log(error);
      }
    )

}

backToGiornata(){
// this.router.navigate(['users']); // rimandavo a elenco utenti
this.router.navigate(['manif/' + this.giornata.idManifestazione]);

}


// non serve più
userSelected: Persona;
updateUser(persona: Persona){
  this.userSelected = persona;
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






}
