import { Component, OnInit } from '@angular/core';

import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';

import { ManifestazioneService }  from './../../services/manifestazione.service'; // ./../../services/fedele.service
import { Manifestazione} from '../../classes/Manifestazione';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// seconda soluzione con popup component
import { ManifestazionepopComponent } from './../../components/popups/manifestazionepop/manifestazionepop.component';
// test
import { Manifestazionepop1Component } from './../../components/popups/manifestazionepop1/manifestazionepop1.component';

@Component({
  selector: 'app-manifestazioni',
  templateUrl: './manifestazioni.component.html',
  styleUrls: ['./manifestazioni.component.css']
})

export class ManifestazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public manifestazioni: Manifestazione[] = [];
  public manifestazione: Manifestazione;

  public title = "elenco Manifestaszioni";
  public Message = '';
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutte',
    'Aperte',
    'Non Aperte',
    'Chiuse'
  ];


  constructor(private manifService: ManifestazioneService,
              private router: Router,
              private modal: NgbModal,
             ) { }

ngOnInit(): void {

  //this.isVisible = false;
  this.loadManifestazioni();
}

async loadManifestazioni() {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.manifService.getManifestazioni().subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
          this.manifestazioni = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Manifestazioni  -- loadManifestazioni - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}


registraManifestazione() {

 alert('devo registrae la nuova manifestazione');

 //  vecchia modalità fino al 02/03/2021
// passare il valore della messa selezionata

// corrette  da ripristinare
// localStorage.setItem("gestioneutente", 'new');
//  ------------------------------------------------------  this.router.navigate(['manif/new']);   vecchia modalità

// 2021/03/02   gestisco nuova registrazione e/o modifica con form popup

  alert('manif - lancio la registrazione Monifestzione via popup');


 // 2021/03/02  utilizzo della popup per gestire la registrazione/modifica Manifestazione

  this.manifestazione = new Manifestazione();
 

  const ref = this.modal.open(ManifestazionepopComponent, {size:'lg'});
  ref.componentInstance.selectedUser = this.manifestazione;

  ref.result.then(
    (yes) => {
      console.log('Click YES');
    },
    (cancel) => {
      console.log('click Cancel');
    }
  )




}



// imposto il filtro di ricerca dei fedeli
onSelectionChange(tifedel: string)   {


this.tipoRichiesta = tifedel.substring(0,1);
this.validSearch = true;
switch (this.tipoRichiesta) {

  case 'T':      //login
      this.stato = 9;
      break;
  case "C":
      this.stato = 2;
      break;
  case "N":
      this.stato = 0;
      break;
  case "A":
      this.stato = 1;
      break;
  default:
      this.stato = 9;
      break;
  }
this.loadManifestazionibyStato(this.stato);
//alert('ho selezionato:' + tifedel + ' valore: ' + this.tipoRichiesta);

}

async loadManifestazionibyStato(stato: number) {

  this.trovatoRec = false;
  this.isVisible = true;
  await  this.manifService.getManifbyStato(stato).subscribe(
   // sentire hidran per lettura particolare
  // this.fedeleService.getFedeliforMessa(id).subscribe(
       res => {
          this.manifestazioni = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.alertSuccess = true;
          this.Message = 'Situazione Attuale - Nessuna manifestazione presente per il tipo di richiesta';
           if(this.nRec > 0){
           this.Message = 'Situazione Attuale';
         }

      //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
      //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
     },
     error => {
        alert('Manifestazione-Data  -- loadManifestazionibyStato: ' + error.message);
        console.log(error);
        this.alertSuccess = false;
        this.Message = error.message;
     }
   )
}

// apertura form di registrazione e/o Modifica tramite popup


openModalPopup(manif: Manifestazione) {
 
  
  const ref =   this.modal.open(ManifestazionepopComponent, {size:'lg'} );  // , { centered: true }
  ref.componentInstance.manif = manif;

  ref.result.then(
    (yes) => {
      console.log('Ok Click');
      // -------------------------------------  mettere messaggio popup di buon esito

   //   let mess01 = '----------------- devo aggiornare la quantità: ' + commandawriga.qta + ' per il prodotto:' + commandawriga.id;
    //  console.log(mess01);
    //  alert('----------------- devo aggiornare la quantità: ' + commandawriga.qta + ' per il prodotto:' + commandawriga.id);
    //  this.updaterigaCommanda(commandawriga);
      // this.setUsersList();  fare la lettura di tutti le commandawriga per essere riaggiornato
  },
  (cancel) => {
    // mettere messaggio info di funzione abbandonata
    console.log('Cancel Click');
  })
}


// -------------------------------   nuovo bottone per apertura popup

RegistrabyPopup() {

  alert(' devo fare aprire popup');

  this.manifestazione = new Manifestazione();

  const ref = this.modal.open(Manifestazionepop1Component, { centered: true });
  ref.componentInstance.selectedUser = this.manifestazione;

  ref.result.then(
    (yes) => {
      console.log('Click YES');
      this.loadManifestazioni();
    },
    (cancel) => {
      console.log('click Cancel');
    }
  )

}

/*
private setUsersList() {
  this.manifService.getManifestazioni().subscribe(x => {
    this.manifestazioni = x;
  })
}
*/



}
