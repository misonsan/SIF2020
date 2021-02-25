import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Commandaw } from '../../classes/Commandaw';
import { Commandawriga } from '../../classes/Commandawriga';
// provvisoria - va spostato su commandaw2-detail per creazione effettiva
import { Commanda } from '../../classes/Commanda';

import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { CommandawService }  from './../../services/commandaw.service';
// provvisoria - VA SPOSTATA SU COMMANDAW2-DETAIL PER CREAZIONE effettiva
import { CommandaService } from './../../services/commanda.service';
import { CommandawrigaService } from './../../services/commandawriga.service';

import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-commandaw1-detail',
  templateUrl: './commandaw1-detail.component.html',
  styleUrls: ['./commandaw1-detail.component.css']
})
export class Commandaw1DetailComponent implements OnInit {

  public title = 'Registrazione Prodotti Commanda  -  Commandaw1-detail';

 // definizione delle icone utilizzate
 faSave = faSave;
 faUndo = faUndo;
 faHandPointLeft = faHandPointLeft;
 faTrashAlt = faTrashAlt;
 faInfoCircle = faInfoCircle;
 faThumbsUp = faThumbsUp;
 faThumbsDown = faThumbsDown;
 faSearch = faSearch;
 faPlusSquare = faPlusSquare;

// variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;

public textMessage1 = '';
public textMessage2 = '';
public textUser = '';
public headerPopup = '';
public Message = '';


public manif: Manifestazione;
public giornata: Giornata;
public commandaw: Commandaw;
public commandawriga: Commandawriga;
public commandawrighe: Commandawriga[] = [];

// temporanea
public commanda: Commanda;
public commandanew: Commanda;

public nRec = 0;
public trovatoRec = false;
public tipoRichiesta = '?';
public ricManif = 0;
public validSearch = false;
private textMessage = '';
public nDay = 0;
public statoRic = 0;
public registrata = false;
public statotip = 0;

public nProdOrd = 0;
public iProdOrd = 0;

// per passare dati da figlio a padre
public qtaPassato = '';

// provvisori  - da spostare in commandaw2-detail per pagamento e creazione commanda definitiva

public newCommandaid = 0;
public newCommandanProdotti = 0;
public newCommandaiProdotti = 0;
public newCommandaCoperto = 0;
public idDay = 0;


// per paginazone
p: number = 1;

constructor(private router: Router,
           private route: ActivatedRoute,
           private manifService: ManifestazioneService,
           private giornataService: GiornataService,
           private commandawService: CommandawService,
           private commandaService: CommandaService,
           private commandawrigaService: CommandawrigaService
           ) { }

ngOnInit(): void {
  // nella url passo il codice della giornata
   this.isVisible  = true;
   this.registrata = false;
   this.commandaw = new Commandaw();
   this.route.paramMap.subscribe(p => {
   this.commandaw.id = +p.get('id');
   // -------  leggo i dati della commanda di lavoro
   alert('cammandaw1 - OnInit: ' + this.commandaw.id);
   this.loadCommandaW(this.commandaw.id);
   });
}


async loadCommandaW(id: number) {

 // alert('loadCommandaW : ' + id);

  await this.commandawService.getCommandaw(id).subscribe(
    response => {
      this.commandaw = response['data'];
  //    alert('loadCommandaW : step1 ');
      this.loadGiornata(this.commandaw.idGiornata)
  //    alert('loadCommandaW : ------- step2 ');
      this.alertSuccess = true;
      this.Message = "Situazione Attuale";
    },
    error => {
      this.isVisible  = true;
      this.Message = error.message;
      this.alertSuccess = false;
    alert('Manif-Data  --loadCommandaw: ' + error.message);
    console.log(error);
    }
  )
}


async loadGiornata(id: number) {
  //    alert('loadGiornata - id:' + id);
   await this.giornataService.getGiornata(id).subscribe(
   response => {
     this.giornata = response['data'];
     this.loadManifestazione(this.giornata.idManifestazione);

    },
   error => {
     this.isVisible  = true;
     this.Message = error.message;
     this.alertSuccess = false;
   alert('Manif-Data  --loadGiornata: ' + error.message);
   console.log(error);
   }
 )
}

// recupero i dati della messa
async loadManifestazione(id: number) {
 //   alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
   await  this.manifService.getManifestazione(id).subscribe(
   response => {
   this.manif = response['data'];
   },
   error => {
     this.isVisible  = true;
     this.Message = error.message;
     this.alertSuccess = false;
   alert('Manif-Data  --loadManifestazione: ' + error.message);
   console.log(error);
   }
 )
}

backToGiornata(){
// this.router.navigate(['users']); // rimandavo a elenco utenti
this.router.navigate(['manif/' + this.giornata.idManifestazione]);

}




ricercaCommande(){
alert(' da fare');
}


resetForm(form) {
   alert('reset form  - da fare');
  /*
     this.commandaw = new Commandaw();
     const keyUser = localStorage.getItem("UserCommanda");
     this.commandaw.id =   +keyUser;  */
  }

  async createCommanda(commandaw: Commandaw)  {

    alert('create commanda - da fare  ');
    /*
      this.isVisible  = true;
      const keyUser = localStorage.getItem("UserCommanda");
      this.commandaw.id = +keyUser;
      this.CancellaOldCommanda(commandaw.id)  */
  }


  prodottoSelected: Commandawriga;
  updateProdotto(commandawriga: Commandawriga){
    this.prodottoSelected = commandawriga;
  }



  PagaCommanda() {
    this.calcoloImportoProdotti();
    this.router.navigate(['commandaw2/' + this.commandaw.id]);

  }


async calcoloImportoProdotti() {
  // alert('--------------------------------     registraCommandaRighe')

      this.nProdOrd = 0;
      this.iProdOrd = 0;
     await this.commandawrigaService.getProdottiOrdinati(this.commandaw.id).subscribe(
       response => {
           if(response['number'] > 0) {            //  response['success']
             this.commandawrighe = response['data'];
          alert('----------   registraCommandaRighe  - trovate ' + response['number'] + ' prodotti da clonare');
             this.CalcolaProdottiOrdinati();
        //     alert('---------------------------     registraCommandaRighe ------->  step __01');

           }
       },
       error =>
       {

        this.Message = error.message;
        this.alertSuccess = false;
         console.log(error);
       }
     );
   }

  async CalcolaProdottiOrdinati() {

    this.nProdOrd = 0;
    this.iProdOrd = 0;

     for(let ordinato of this.commandawrighe) {
          this.nProdOrd = this.nProdOrd + ordinato.qta;
          this.iProdOrd = this.iProdOrd + (ordinato.qta * ordinato.prezzo_day);
       }

      this.commandaw.numProdotti = this.nProdOrd;
      this.commandaw.importoProdotti = this.iProdOrd;
      this.commandaw.importodaPagare = this.commandaw.importoProdotti + this.commandaw.importoCoperto - this.commandaw.buonoPasto;
      await this.commandawService.updateCommanda(this.commandaw).subscribe(
        response => {
            if(response['success']) {
    //                  alert('----------------------    inserito commandariga' + prg);
            }
        },
        error =>
        {
          console.log(error);
          this.Message = error.message;
          this.alertSuccess = false;
        }
    );
}

  async RegistraProdottiCommanda()  {

    alert('metodo spostato in fase di conteggio pagamento');




// --------------------  da togliere metodi di calcolo per nuova commanda


    // attenzione     attenzione     attennzione
   // provvisorio qui per vedere se creo correttamente la nuova commanda
   // da spostare quando faccio il pagamento
   // devo fare anche la stampa della commanda

   await this.commandawService.getCommandaw(this.commandaw.id).subscribe(
    response => {
      this.commandaw = response['data'];
      if(this.commandaw.numProdotti > 0 ) {
               // recupero il giorno attivo
               this.letturaGiornataAttiva();

               // recupero il costo del coperto per calcolare quando addebitare

               this.loadManif(this.idDay);

               // recupero il numero della prossima Commanda
               this.loadLastCommanda();

               // conteggio prodotti e importi prodotti
               this.CalcolaProdottiAcquistati();

               //  crea la nuova commanda
               this.CreaNewCommanda();
               alert('RegistraNewCommanda --------CreataCommanda -----------  step4');
               //  crea righe commanda
               // this.CreaNewCommandaRighe();
         }  else {
           alert('devi ancora effettuare la selezione dei prodotti /n funzione non eseguibile');
           return;
         }
      },
      error => {
        this.isVisible  = true;
        this.Message = error.message;
        this.alertSuccess = false;
      alert('Manif-Data  --loadCommandaw: ' + error.message);
      console.log(error);
    }
  )

}










// attenzione  Metodi da spostare in commandaw2-detail dove:
// effettuo il pagamente - genero la commanda e righe - stampo ricevuta


async letturaGiornataAttiva() {

  await   this.giornataService.getGiornataactive().subscribe(
            response => {
  //     alert('letto giornata attiva: ' + response['number'] ) ;
               if(response['number'] == 1) {
                 this.giornata = response['data'];
        //         alert('idGiornata: ' + this.giornata.id);
                 this.idDay = this.giornata.id;

        //         alert('idDay giornata attiva: ' + this.idDay ) ;

          } else {
          //
         }
     },
     error => {
        alert('commandaw1-detail  -- letturaGiornataAttiva - errore: ' + error.message);
        console.log(error);
     }
   )
}






     // recupero i dati della messa
     async loadManif(id: number) {
      // alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
      await  this.manifService.getManifestazione(id).subscribe(
      response => {
          this.manif = response['data'];
          this.newCommandaCoperto = this.manif.impCoperto;
      },
      error => {
      alert('Commandaw11-Detail  --loadManif: ' + error.message);
      console.log(error);
      }
    )

}

async loadLastCommanda()  {
  await  this.commandaService.getLastCommandaid().subscribe(
    response => {

    //  alert('letto ultimo numero commanda');
      this.commanda = response['data'];

    },
    error => {
    alert('Commandaw1-Detail  --loadlastCommanda: ' + error.message);
    console.log(error);
    }
  )

  }

  CalcolaProdottiAcquistati()  {

    //  da fare
    // test
    this.newCommandanProdotti = 15;
    this.newCommandaiProdotti = 25.50;


  }


 async  CreaNewCommanda() {

    this.commandanew = new Commanda();
    this.newCommandaid = this.commanda.id + 1;
    this.commandanew.id = this.newCommandaid;
    this.commandanew.anagrafica_cliente = this.commandaw.anagrafica_cliente;
    this.commandanew.idGiornata = this.idDay;
    this.commandanew.numTavolo = this.commandaw.numTavolo;
    this.commandanew.numPersone = this.commandaw.numPersone;
    this.commandanew.numProdotti =  this.newCommandanProdotti;
    this.commandanew.importoProdotti = this.newCommandaiProdotti;
    this.commandanew.importoCoperto = this.newCommandaCoperto * this.commandaw.numPersone;
    this.commandanew.dtCommanda = new Date();
    this.commandanew.stato = this.commandaw.stato;

    alert('--------------------------------------   pronto per scrivere nuova Commanda');




    await  this.commandaService.createCommanda(this.commandanew).subscribe(
      response =>  {
            if(response['success']) {
              this.commandanew = response['data'];
              alert('commanda ' + this.commanda.id + ' Creata con successo');
           } else {
             alert(response['message']);
           }
      },
      error => {
      alert('Commandawl-detail  --CreaNewCommanda: ' + error.message);
      console.log(error);
      }
    )
  }


/*
  onProdottiCreated(qta: string){
    this.qtaPassato.push(qta);
 }
*/


}
