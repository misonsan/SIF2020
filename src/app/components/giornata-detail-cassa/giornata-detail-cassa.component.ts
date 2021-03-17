import { Component, Input, OnInit } from '@angular/core';

import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Cassaw } from '../../classes/Cassaw';
import { Commanda } from '../../classes/Commanda';
import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { CommandaService } from './../../services/commanda.service';
import { CassawService } from './../../services/cassaw.service';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CassapopComponent } from './../../components/popups/cassapop/cassapop.component';


@Component({
  selector: 'app-giornata-detail-cassa',
  templateUrl: './giornata-detail-cassa.component.html',
  styleUrls: ['./giornata-detail-cassa.component.css']
})
export class GiornataDetailCassaComponent implements OnInit {

  private giornatacopy;
  private __giornata;

  // per gestire il reset

 //  get - set
 @Input() set giornata(giornata: Giornata) {
  this.__giornata = giornata;
  this.giornatacopy = Object.assign({}, giornata);
}

get giornata() {
  return this.__giornata;
}
     // definizione delle icone utilizzate
     faSave = faSave;
     faUndo = faUndo;
     faHandPointLeft = faHandPointLeft;
     faTrashAlt = faTrashAlt;
     faInfoCircle = faInfoCircle;
     faThumbsUp = faThumbsUp;
     faThumbsDown = faThumbsDown;
     faPlusSquare = faPlusSquare;

// variabili per editazione messaggio
    public alertSuccess = false;
    public savechange = false;
    public isVisible = false;

    public textMessage1 = '';
    public textMessage2 = '';
    public textUser = '';
    public headerPopup = '';

  public title = 'situagione giornaliera Cassa  -  giornata-detail-cassa works!';
  public manif: Manifestazione;
  public cassaw: Cassaw;
  public commanda: Commanda;
  
  //public giornata: Giornata;
  //  campi calcolati per editazione
  // sbilancio
  public s100 = 0;
  public s050 = 0;
  public s020 = 0;
  public s010 = 0;
  public s005 = 0;
  public smoneta = 0;
  // valore iniziale
  public vi100 = 0;
  public vi050 = 0;   
  public vi020 = 0;
  public vi010 = 0;
  public vi005 = 0;
  public vimoneta = 0;
  // valore attuale
  public va100 = 0;
  public va050 = 0;
  public va020 = 0;
  public va010 = 0;
  public va005 = 0;
  public vamoneta = 0;
  // valore finale
  public vf100 = 0;
  public vf050 = 0;
  public vf020 = 0;
  public vf010 = 0;
  public vf005 = 0;
  public vfmoneta = 0;
  // valore sbilancio
  public vs100 = 0;
  public vs050 = 0;
  public vs020 = 0;
  public vs010 = 0;
  public vs005 = 0;
  public vsmoneta = 0;
  // totali
  public tinizio = 0;
  public tattuale = 0;
  public tfinale = 0;
  public tsbilancio = 0;

  public message = '';
  public enabledCassaFinale = false;
  public enabledCassaIniziale = false;

  public trovatoRec = false;
  public nRec = 0;
  public keyCassaw = 0;
  public CassaCaricata = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private manifService: ManifestazioneService,
              private giornataService: GiornataService,
              private commandaService: CommandaService,
              public modal: NgbModal,
              private cassawService: CassawService
               ) { }

  ngOnInit(): void {
    this.giornata = new Giornata();
    this.route.paramMap.subscribe(p => {
         // -------  leggo i dati della giornata
          this.loadGiornata(+p.get('id'));
   
    //      alert('loadGiornata - finito OnInit');
      });
  }
  async loadGiornata(id: number) {
 //   alert('loadGiornata - id:' + id);
    await this.giornataService.getGiornata(id).subscribe(
      response => {
       this.giornata = response['data'];
  
             // leggo i dati della manifestazione
         this.loadManifestazione(this.giornata.idManifestazione);
           this.conteggiaValori();
          //  alert('loadGiornata - effettuato ricalcolo');

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

registra() {

  alert('faccio partire popup per la registrazione Cassa -  da fare');

  // cancello la vecchia cassaw e la ricreo con la data della giornata selezionata
  this.ricreaCassaw();
  
  const ref = this.modal.open(CassapopComponent, {size:'lg'});
  ref.componentInstance.selectedUser = this.cassaw;                               //this.cassaw;

  ref.result.then(
    (yes) => {
      console.log('Click YES');
    },
    (cancel) => {
      console.log('click Cancel');
    }
  )

}


ricreaCassaw() {
    this.CancellaCassaw();
    this.creaCassaw();
}



// metodo non più necessario da quando passo giornata e non cassaw
CancellaCassaw() {
  // cancello la vecchia Cassaw e la ricreo con la data della giornata selezionata
  this.cassaw = new Cassaw();
  this.cassawService.deleteCassa(this.cassaw).subscribe(
    response => {
      if(response['success']) {
 
      } else {
        alert(response['message']);
        this.message = response['message'];
        this.alertSuccess = false;
      }
  },
  error =>
  {
    console.log(error);
    this.message = error.message;
    this.alertSuccess = false;
  }
  );

}

creaCassaw() {
  this.cassaw.idDay = this.giornata.id;
  this.cassaw.dtGiornata = this.giornata.dtGiornata;
  this.cassaw.statoCassa = this.giornata.statoCassa;
  this.cassawService.createCassa(this.cassaw).subscribe(
    response => {
      if(response['success']) {
           // non faccio niente e apro popup
      } else {
        alert(response['message']);
        this.message = response['message'];
        this.alertSuccess = false;
      }
  },
  error =>
  {
    console.log(error);
    this.message = error.message;
    this.alertSuccess = false;
  }
  );
}




ricalcolaValori(imp: number) {
//  alert('ho modificato i dati di una cella' + imp);
  this.conteggiaValori();

}


// funziona ma non visualliza alert in caso di errore
onSearchChange(imp) {
 //  alert('--------------- ho modificato i dati di una cella' + imp);
  if (isNaN(imp)){
		alert('Il valore inserito non è numerico');
	} else {
		this.conteggiaValori();
	}

}

myFunctionOut(x) {

  x.style.background = "white";
  if (isNaN(x)){
		alert('Il valore inserito non è numerico 1');
	} else {
		this.conteggiaValori();
	}
}

myFunction(x) {

  x.style.background = "yellow";

}


conteggiaValori() {

  // utilizati per la vecchia gestione degli aggiornamenti di cassa
  // ora con la gestione popup tutti i campi della mappa sono disabled e 
  // aggiornamento cassa lo faccio da popup

  /*
  this.enabledCassaFinale = false;
  this.enabledCassaIniziale = false;

  switch (this.giornata.statoCassa) {
    case 0:
    case 1:
       this.enabledCassaFinale = false;
       this.enabledCassaIniziale = true;
       break;
    case 2:
       this.enabledCassaFinale = true;
       this.enabledCassaIniziale = false;
       break;
     }
*/


    this.eseguoConteggioValori();

}


eseguoConteggioValori()  {


  // valori iniziali
  this.vi100 = this.giornata.i100 * 100;
  this.vi050 = this.giornata.i050 * 50;
  this.vi020 = this.giornata.i020 * 20;
  this.vi010 = this.giornata.i010 * 10;
  this.vi005= this.giornata.i005 * 5;
  this.vimoneta = this.giornata.icontante;
  // valori attuali
  this.va100 = this.giornata.a100 * 100;
  this.va050 = this.giornata.a050 * 50;
  this.va020 = this.giornata.a020 * 20;
  this.va010 = this.giornata.a010 * 10;
  this.va005= this.giornata.a005 * 5;
  this.vamoneta = this.giornata.acontante;

 // valori finali
  this.vf100 = this.giornata.f100 * 100;
  this.vf050 = this.giornata.f050 * 50;
  this.vf020 = this.giornata.f020 * 20;
  this.vf010 = this.giornata.f010 * 10;
  this.vf005= this.giornata.f005 * 5;
  this.vfmoneta = this.giornata.fcontante;

 // sbilancio
 if(this.giornata.f100 == 0  &&
      this.giornata.f050 == 0  &&
      this.giornata.f020== 0  &&
      this.giornata.f010 == 0  &&
      this.giornata.f005 == 0  &&
      this.giornata.fcontante)  {
        this.s100 = this.giornata.a100 - this.giornata.i100;
        this.s050 = this.giornata.a050 - this.giornata.i050;
        this.s020 = this.giornata.a020 - this.giornata.i020;
        this.s010 = this.giornata.a010 - this.giornata.i010;
        this.s005 = this.giornata.a005 - this.giornata.i005;
        this.smoneta = this.giornata.acontante - this.giornata.icontante;
      }   else {
        this.s100 = this.giornata.f100 - this.giornata.i100;
        this.s050 = this.giornata.f050 - this.giornata.i050;
        this.s020 = this.giornata.f020 - this.giornata.i020;
        this.s010 = this.giornata.f010 - this.giornata.i010;
        this.s005 = this.giornata.f005 - this.giornata.i005;
        this.smoneta = this.giornata.fcontante - this.giornata.icontante;
      }





  this.vs100 = this.s100 * 100;
  this.vs050 = this.s050 * 50;
  this.vs020 = this.s020 * 20;
  this.vs010 = this.s010 * 10;
  this.vs005= this.s005 * 5;
  this.vsmoneta = this.smoneta;
  //  totali
  this.tinizio = this.vi100 + this.vi050 + this.vi020 +
                 this.vi010 + this.vi005 + (this.giornata.icontante * 1);

  this.tattuale = this.va100 + this.va050 + this.va020 +
                 this.va010 + this.va005 + (this.vamoneta * 1);
  this.tfinale = this.vf100 + this.vf050 + this.vf020 +
                 this.vf010 + this.vf005 + (this.vfmoneta * 1);
  this.tsbilancio = this.s100 + this.s050 + this.s020 +
                 this.s010 + this.s005 + (this.smoneta * 1);
}


save() {
  //alert('cassa-salva    da fare');
  if (this.giornata.id > 0) {
    this.updateGiornataCassa(this.giornata);
} else {
    this.createGiornataCassa(this.giornata);
}
  this.savechange = true;
  this.alertSuccess = true;

}

resetForm(form) {
  alert('cassa-reset form  -  da fare');

  if (this.giornata.id === 0) {
    this.giornata = new Giornata();
  } else {
    this.giornata = this.giornatacopy;
  }



}

backToGiornata(){
  // this.router.navigate(['users']); // rimandavo a elenco utenti
   this.router.navigate(['manif/' + this.giornata.idManifestazione]);

}

updateGiornataCassa(giornata: Giornata) {
   //alert('cassa- sono in update cassa -  da fare');

   this.isVisible = true;
 // aggiorno lo stato della giornata
   this.giornata.stato = 1;
   this.giornata.statoCassa = 1;
   if(this.giornata.statoCassa === 1 && this.giornata.statoMagazzino === 1  && this.giornata.statoUtenti === 1) {
      this.giornata.stato = 2;
   }
   this.giornataService.updateGiornata(this.giornata).subscribe(
      response => {
          if(response['success']) {
             this.message = 'Cassa ' + giornata.d_stato_cassa + ' Modificata con successo';
             this.alertSuccess = true;
           //  alert(this.message);
          //   this.router.navigate(['users']);
          } else {
            alert(response['message']);
            this.message = response['message'];
            this.alertSuccess = false;
          }
      },
      error =>
      {
        console.log(error);
        this.message = error.message;
        this.alertSuccess = false;
      }
    );


}

createGiornataCassa(giornata: Giornata)  {
  alert('cassa- sono in create cassa -  da fare');

  //  non eseguibile - la cassa fa parte della giornata quindi aggiorno i campi della cassa
  /*
 this.messaService.createMessa(this.messa).subscribe(
      response => {
          if(response['success']) {
            this.message = 'Messa ' + messa.demessa + ' Inserita   con successo';

        //    il messaggio viene visualizzato sul dettaglio e il ritorno a elenco lo faccio a mano

        //    alert('Utente ' + user.name + ' Inserito   con successo');
       //     this.router.navigate(['users']);
          } else {
            alert(response['message']);
             this.alertSuccess = false;
           }
      },
      error =>
      {
        console.log(error);
        this.alertSuccess = false;
      }
    );


  */

}

// conferma a registrazione cassa
showPopupConfirm() {

alert('showPopup');
  this.textMessage1 = 'Confermi la registrazione';
  this.eseguoConteggioValori();
// verifico se ho emesso delle commande per impostare lo stato
   this.aggiornaCassa();

}

async aggiornaCassa() {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;

  await  this.commandaService.getCommande().subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
        //  this.manifestazioni = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;

       //  alert('Giornata-Detail   -- loadCommande : ' + this.nRec + ' stato: ' + this.trovatoRec);

         this.aggiornaGiornata();
       },
      error => {
         alert('Manifestazioni  -- loadManifestazioni - errore: ' + error.message);
         console.log(error);
       }
    )
}

aggiornaGiornata()  {

  if(this.nRec == 0) {

    this.headerPopup = 'Caricamento Cassa Iniziale';
    this.textMessage2 = 'Cassa Iniziale';
    this.giornata.statoCassa = 1;






              // salvo su cassa attuale i dati di cassa attuale
    this.giornata.a100 = this.giornata.i100;
    this.giornata.a050 = this.giornata.i050;
    this.giornata.a020 = this.giornata.i020;
    this.giornata.a010 = this.giornata.i010;
    this.giornata.a005 = this.giornata.i005;
    this.giornata.acontante = this.giornata.icontante;
     // salvo i totali

     this.giornata.cassaInizio = this.tinizio;
     this.giornata.cassaAttuale = this.tinizio;

   } else {
    this.giornata.statoCassa = 2;
    this.headerPopup = 'Caricamento Cassa Finale';
    this.textMessage2 = 'Cassa Finale';
    this.giornata.cassaFinale = this.tfinale;
   }
   if(this.giornata.statoMagazzino == 1  &&
    this.giornata.statoUtenti == 1) {
      this.giornata.stato = 2;
    }

}



}






