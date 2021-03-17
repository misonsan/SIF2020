
// esempio di promise  - da guardare bene


import { Component, OnInit } from '@angular/core';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faUserEdit, faTrash, faInfo, faInfoCircle, faPlusSquare, faSearch, faSave } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TabellaTService} from '../../services/tabella-t.service';
import { TabellaTwService } from '../../services/tabella-tw.service';
import { TabellaTwDettService } from '../../services/tabella-tw-dett.service';

import { Tabellat } from '../../classes/tabella_t';
import { Tabellatw } from '../../classes/tabella_tw';
import { TabellatwDett } from '../../classes/tabella_tw_dett';
// componenti delle tabelle utenti
import { Ttipologia } from '../../classes/T_tipologia';
import { TtipologiaService } from '../../services/ttipologia.service';

//import { ProdottodaypopComponent } from './../../components/popups/prodottodaypop/prodottodaypop.component';
//import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';





@Component({
  selector: 'app-tabelle',
  templateUrl: './tabelle.component.html',
  styleUrls: ['./tabelle.component.css']
})
export class TabelleComponent implements OnInit {

public tabellet: Tabellat[]=[];
public tabellat: Tabellat;
public tabellatw: Tabellatw;
public tabelletwDett: TabellatwDett[]=[];
public tabellatwDett: TabellatwDett;

// tabelle utente
public ttipologie: Ttipologia[]=[];
public ttipologia: Ttipologia;

// icone
faPlusSquare = faPlusSquare;
faSearch = faSearch;
faSave = faSave;
faUserEdit = faUserEdit;

public title = "elenco Tabelle";

// variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;

public nRecMan = 0;
public nRec = 0;
public trovatoRec = false;
public Message = '';
public isSelected = false;
public tabellaSelected = 0;
public selectedCorrect = 'N';
public keyTabella = 0;
public type = '';
public prg = 0;
public stato = 'A';

/* public modal: NgbActiveModal, */
constructor(private tabellaTwService: TabellaTwService,
            private tabellaTwDettService: TabellaTwDettService,
            private tabellatService: TabellaTService,
            private ttipologiaService: TtipologiaService,
            private formBuilder: FormBuilder,
            private modalService: BsModalService,
            private router: Router,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

  ngOnInit(): void {

    this.tabellatw = new Tabellatw();
    this.cancellaTabella(this.tabellatw);
    this.loadTabelle();
  }



  
  cancellaTabella(tabellatw: Tabellatw) {
    this.tabellaTwService.deleteTabella(tabellatw).subscribe(
      res => {
       },
       error => {
          alert('Tabellet  -- cancellaTabellatw - errore: ' + error.message);
          console.log(error);
       })
  }


async loadTabelle() {

 //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
 this.trovatoRec = false;
 this.nRec = 0;
 this.isVisible = true;
 await  this.tabellatService.getTabelle().subscribe(
    res => {
         this.tabellet = res['data'];
         this.nRec = res['number'];
         this.trovatoRec = true;
         this.Message = 'Situazione Attuale';
         this.alertSuccess = true;
  //     alert('tabelle   -- loadtabelle :  fine ok ' + this.nRec);
      },
     error => {
        alert('Tabellet  -- loadTabelle - errore: ' + error.message);
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
     }
   )

}

NuovoElemento() {

  alert('da fare');
}

selectedTabella(selectedValue: number) {

  this.tabellatService.getTabella(selectedValue).subscribe(
    res => {
             this.tabellat = res['data'];
             if(this.tabellat.fatto === 'N') {
                this.alertSuccess = false;
                this.type = 'error';
                this.Message = 'Tabella non ancora gestita (1) - gestione non eseguibile - tabella: ' + selectedValue;
                this.showNotification(this.type, this.Message);
                return;
             } else {
                this.tabellaSelected = selectedValue;
                this.tabellatw = new Tabellatw();
                // this.CaricaTabellaSelezionata(this.tabellatw);
                this.creaTabellatw();
             }
           },
    error => {
             alert('Tabellet  -- LeggiTabellaSelected - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
           }
        );
 }


 

 
/*
  async ElaboraTabellaSelected(id: number) {
   await   this.tabellatService.getTabella(id).subscribe(
            res => {
               this.tabellat = res['data'];
               if(this.tabellat.fatto === 'N') {
                this.type = 'error';
                this.Message = 'Tabella non ancora gestita - gestione non eseguibile';
                this.showNotification(this.type, this.Message);
                return;
               } else {
                 this.caricaTabellaSelected(id);
               }
           
       //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
         },
        error => {
           alert('Tabellet  -- LeggiTabellaSelected - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
          )
   }

async   caricaTabellaSelected(id) {
    alert('carica tabella selezionata - da fare');
  }
*/

/*

*/



 

/*

  async     LoadTabellaSelected(id: number) {
        await  this.tabellatService.getTabella(id).subscribe(
          res => {
               this.tabellat = res['data'];
               if(this.tabellat.fatto === 'N') {
                this.type = 'error';
                this.Message = 'Tabella non ancora gestita - gestione non eseguibile';
                this.showNotification(this.type, this.Message);
               } else {
                 this.caricaTabellaSelected(id);
               }
          //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
            },
           error => {
              alert('Tabellet  -- loadTabelle - errore: ' + error.message);
              console.log(error);
              this.Message = error.message;
              this.alertSuccess = false;
           }
         )
       }

 */


/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}




/*

async CaricaTabellaSelezionata(tabellatw: Tabellatw) {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.tabellaTwService.deleteTabella(tabellatw).subscribe(
     res => {
            this.creaTabellatw();
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Tabellet  -- cancellaTabellatw - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}
*/

 creaTabellatw() {
  this.tabellatw = new Tabellatw();
  this.tabellatw.idTab = this.tabellaSelected;
  this.tabellatw.nametab = this.tabellat.nametab;
  this.tabellaTwService.createTabella(this.tabellatw).subscribe(
   async res => {
    await   this.creaTabellatwDett(this.tabellaSelected, this.tabellat.nametab);
//     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
        },
        error => {
          alert('Tabellet  -- loadTabelle - errore: ' + error.message);
          console.log(error);
          this.Message = error.message;
          this.alertSuccess = false;
        }
  )
}

creaTabellatwDett(id: number, namtab: string) {

   // fare metodi specifici per caricare elementi tabella
  this.selectedCorrect = 'N';
  switch (namtab) {

  case 't_categoria_prodotto':
     break;
  case 't_competenza_prodotto':
    break;
  case 't_ruolo':
    break;
  case 't_stato_bevande':
    break;
  case 't_stato_cassa':
    break;
  case 't_stato_commanda':
    break;
  case 't_stato_contabile':
    break;
  case 't_stato_cucina':
    break;
  case 't_stato_giornata':
    break;
  case 't_stato_lavorazione':
    break;
  case 't_stato_magazzino':
    break;
  case 't_stato_manifestazione':
    break;
  case 't_stato_persona': 
    break;
  case 't_stato_prodotto':
    break;
  case 't_stato_rigacommanda':
    break;
  case 't_stato_utente':
    break;
  case 't_taglia':
    break;
  case 't_tipologia':
    this.loadTtipologia(id);
    break;
  case 't_titolo':
    break;
  }

  alert('creaTabellatwDett -----  dopo switch ' + this.selectedCorrect);
  if(this.selectedCorrect === 'S') {
        // vecchia e originaria modalità
        this.LoadElementiTabella();

        this.type = 'success';
        this.Message = 'situazione attuale';
        this.showNotification(this.type, this.Message);
    } else {
      this.type = 'error';
      this.Message = 'Tabella non ancora gestita  (2) - nessun elemento caricato';
      this.showNotification(this.type, this.Message);
    }

}


// modalità originaria con subscrive
   LoadElementiTabella() {
   this.tabellaTwDettService.getelTabelle().subscribe(
   res => {
        this.tabelletwDett = res['data'];
       alert('tabelle   -- loadElementiTabella:  fine ok ' + res['number']);
     },
    error => {
       alert('Tabellet  -- loadTabelle - errore: ' + error.message);
       console.log(error);
       this.Message = error.message;
       this.alertSuccess = false;
    }
  )
  
    }

    

    /*      prova scrittura promisis */   /*  cambiare il metodo ceh recupra i dettagli */
    /*
    async LoadElementiTabellaeProm() {
      try {
        // GET a list of book IDs of the current user
        const resp = await this.tabellaTwDettService.getelTabelle()
        .toPromise()
        .then(res => this.tabelletwDett = res as TabellatwDett[]);
      } catch(error) {
        // If any of the awaited promises was rejected, this catch block
        // would catch the rejection reason
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
       // return null;
      }
    }
    */
/*
    function delay() {
      // `delay` returns a promise
      return new Promise(function(resolve, reject) {
        // Only `delay` is able to resolve or reject the promise
        setTimeout(function() {
          resolve(42); // After 3 seconds, resolve the promise with value 42
        }, 3000);
      });
    }
*/

/*
--- prove di moreno per creare metodo con promise e async await
async loadElemTabella1() {
  
  try {
    //Find item
    let this.tabelletwDett = await this.tabellaTwDettService.getelTabelle();
    return this.tabelletwDett;
} catch (error) {
    console.log(error);
    ctx.throw(400, 'INVALID_DATA');
}


async function fun1(req, res){
  let response = await request.get('http://localhost:3000');
    if (response.err) { console.log('error');}
    else { console.log('fetched response');
}

   async loadElemTabella1(req, res) {
      const response = await this.tabellaTwDettService.getelTabelle();
      if (response.subscribe) { console.log('error');}
      else this.tabelletwDett = res['data'];
    }


questa potrebbe comiciare ad andare benino
products: async (req, res) => {
    if(req.cookies.authenticated) {
        try {
            let data = await req.API.products();
            res.render('products', {
                title: 'Products | WooCommerce Node',
                products: data.products
            });
        } catch(err) {
            res.redirect('/dashboard');
        }
    } else {
        res.redirect('/');
    }
}




*/












async loadTtipologia(id: number) {

  await this.ttipologiaService.getTipolgie().subscribe(
      res => {
            this.ttipologie = res['data'];
            this.selectedCorrect = 'S';
            this.caricaTipologie(id);

            alert('finito loadTtipologia  ------------------->  ' + this.selectedCorrect);
            },
      error => {
          alert('Tabellet  -- loadTabelle - errore: ' + error.message);
          console.log(error);
          this.Message = error.message;
          this.alertSuccess = false;
          }
      );

}


async caricaTipologie(id: number) {

  this.prg = 0;
  for(const elem of this.ttipologie) {
    this.tabellatwDett = new TabellatwDett();
    this.prg = this.prg + 1;
    this.tabellatwDett.id  = elem.id;  //this.prg;
    this.tabellatwDett.idtab = 0;
    this.tabellatwDett.idelTab = elem.id;   //id;    via
    this.tabellatwDett.descrizione = elem.d_tipologia;
    this.tabellatwDett.stato = this.stato;
    await this.tabellaTwDettService.createelTabella(this.tabellatwDett).subscribe(
            response => {
                if(response['success']) {
        //                  alert('----------------------    inserito commandariga' + prg);
                }
                /*
                else {
                  alert(response['message']);
                  this.Message = response['message'];
                  this.alertSuccess = false;
                }  */
            },
            error =>
            {
              console.log(error);
              this.Message = error.message;
              this.alertSuccess = false;
            }
        );
  }
  alert('caricaTipologie:  fine ok ' + this.prg);
  console.log('caricaTipologie:  fine ok ' + this.prg);
}








}
