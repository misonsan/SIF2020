
import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Prodotto } from '../../classes/Prodotto';
import { Giornata } from '../../classes/Giornata';
import { Manifestazione} from '../../classes/Manifestazione';
import { Commanda } from '../../classes/Commanda';
import { Commandawriga } from '../../classes/Commandawriga';
import { Commandaw } from '../../classes/Commandaw';
import { faPlusSquare, faSearch, faSave, faUserEdit, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { CommandawrigaService }  from './../../services/commandawriga.service';
import { CommandawService } from './../../services/commandaw.service';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { CommandaService } from './../../services/commanda.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-prodotto1-detail',
  templateUrl: './prodotto1-detail.component.html',
  styleUrls: ['./prodotto1-detail.component.css']
})
export class Prodotto1DetailComponent implements OnInit {

   //ricevo ti dati dal componente padre (Prodotto)
   @Input() prodotto: Prodotto;
   @Input() commandawriga: Commandawriga;

   // preparo i dati da inviare da figlio a padre per aggiornare
   // il numero dei prodotti acquistati

   @Output() numprod = new EventEmitter<number>();


   public giornata: Giornata;      // serve per importare la giornata per eseguire route a pagina attuale (refesh simulato)
   public manif: Manifestazione;
   public commanda: Commanda;

   public pathImage =  'assets/images/photoProducts/';
   public title = "Situazione Prodotto";
   public displayedImage = '';
   //public user: User;

// icone
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faUserEdit = faUserEdit;
   faMinus = faMinus;
   faPlus = faPlus;

   // variabili per editazione messaggio
   public alertSuccess = false;
   public savechange = false;
   public isVisible = false;

   public nRecMan = 0;
   public nRec = 0;
   public trovatoRec = false;
   public Message = '';
   public isSelected = false;

   public saveValueStd:boolean;

   public commandaw: Commandaw;

   public newCommandaid = 0;
   public newCommandanProdotti = 0;
   public newCommandaiProdotti = 0;
   public newCommandaCoperto = 0;
   public idDay = 0;

// ho tentato di passare i dati dal figlio al padre
// dovrebbe essere corretto il creare eventemitter.
// sbaglio sul ricevente

    constructor(private commandawrigaService: CommandawrigaService,
                private commandawService: CommandawService,
                private manifService: ManifestazioneService,
                private commandaService: CommandaService,
                 private route: ActivatedRoute,
                 private router: Router) { }


     ngOnInit(): void {
       this.isVisible = false;
       this.isSelected = false;
       this.displayedImage = this.pathImage + '0.jpg';
       this.saveValueStd = false;
       this.Message = '';
    }


    onCreatenumprod() {
      this.numprod.emit(this.commandaw.numProdotti);
  }
    /*
    onChange(deviceValue) {
     if(deviceValue == '?') {
       alert('Effettuare la selezione !!');
       this.isSelected = false;
       return;
     } else {
       this.isSelected = true;
     }
    }  */



    onSaveValueStdChanged(value:boolean){
       this.saveValueStd = value;

   //    alert('esito checkbox: ' + value);
       if (value) {
         this.prodotto.disponibile_Day = this.prodotto.disponibile;
         this.prodotto.prezzo_day = this.prodotto.prezzo;
       } else {
         this.prodotto.disponibile_Day = 0;
         this.prodotto.prezzo_day = 0;
       }

   }



    onOptionsSelected(value:string){

       if(value == '?') {
         alert('Effettuare la selezione !!');
         this.isSelected = false;
         return;
       } else {
         this.isSelected = true;
       }
    }


   Salva(commandawriga) {
     if(commandawriga.qta == 0) {
       alert('Selezione non ammessa  \n aggiornamento non possibile !!');
        return;
     }  else {
       this.updaterigaCommanda(commandawriga);
       this.refreshPage();
     }
   }

 async  updaterigaCommanda(commandawriga: Commandawriga) {
 //alert('cassa- sono in update cassa -  da fare');
 this.isVisible = true;
 await  this.commandawrigaService.updateCommandawriga(commandawriga).subscribe(
        response => {
            if(response['success']) {
              this.updateCommanda(commandawriga);
            } else {
              alert(response['message']);
              this.Message = response['message'];
              this.alertSuccess = false;
        }},
        error =>
        {
          console.log(error);
          this.Message = error.message;
          this.alertSuccess = false;
        }
     );
 }

 async  updateCommanda(commandawriga: Commandawriga) {
  //alert('cassa- sono in update cassa -  da fare');
  this.isVisible = true;
  await  this. commandawService.getCommandaw(commandawriga.idCommanda).subscribe(
         response => {
             if(response['data']) {
               this.Message = 'Prodotto: ' + commandawriga.descrizione_prodotto + 'Aggiornato correttamente  ';

              alert('check_01 -------> ' + this.Message);
               this.commandaw  = response['data'];
               this.commandaw.numProdotti =  this.commandaw.numProdotti + commandawriga.qta;
               this.commandaw.importoProdotti =  this.commandaw.importoProdotti + (commandawriga.qta * commandawriga.prezzo_day);
               this.commandaw.importodaPagare = this.commandaw.importoProdotti + this.commandaw.importoCoperto - this.commandaw.buonoPasto;
                this.updateVendutoCommanda(this.commandaw)
              } else {
               alert(response['message']);
               this.Message = response['message'];
               this.alertSuccess = false;
         }},
         error =>
         {
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
         }
      );
  }

  async  updateVendutoCommanda(commandaw: Commandaw) {
    alert('cupdateVendutoCommanda ----   entry');
    this.isVisible = true;
    await  this. commandawService.updateCommanda(commandaw).subscribe(
           response => {
            alert('check_02 -    updateCommanda ------> ');
               if(response['success']) {
                 this.alertSuccess = true;
               } else {
                 alert(response['message']);
                 this.Message = response['message'];
                 this.alertSuccess = false;
           }},
           error =>
           {
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
           }
        );
    }


 refreshPage() {
  this.onCreatenumprod();    // creo evento per passare il numero prodotti al padre
 }





 tolgoProdotti() {
  this.commandawriga.qta = this.commandawriga.qta - 1;
 }

 aggiungoProdotti() {
    this.commandawriga.qta = this.commandawriga.qta + 1;
 }


/*
 Rilascia() {
   alert('pronto per il rilascio  /n aggiorno i totali della commanda da loop righe /n e passaggio alla cassa')



// togliere - spostato provvisoriamente in  commandaw1-detail


   // recupero il costo del coperto per calcolare quando addebitare
    this.idDay = parseInt(localStorage.getItem('idGiornata'));

    this.loadManifestazione(this.idDay);

// recupero il numero della prossima Commanda
    this.loadLastCommanda();
    // conteggio prodotti e importi prodotti
    this.CalcolaProdottiAcquistati();
    //  crea la nuova commanda
    this.CreaNewCommanda();
    //  crea righe commanda
    // this.CreaNewCommandaRighe();








 }

       // recupero i dati della messa
       async loadManifestazione(id: number) {
        // alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
        await  this.manifService.getManifestazione(id).subscribe(
        response => {
            this.manif = response['data'];
            this.newCommandaCoperto = this.manif.impCoperto;
        },
        error => {
        alert('Prodotto1-Detail  --loadManifestazione: ' + error.message);
        console.log(error);
        }
      )

  }

  async loadLastCommanda()  {
    await  this.commandaService.getLastCommandaid().subscribe(
      response => {

        alert('letto ultimo numero commanda');
        this.commanda = response['data'];

      },
      error => {
      alert('Prodotto1-Detail  --loadManifestazione: ' + error.message);
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

      this.newCommandaid = this.commanda.id + 1;
      this.commanda.id = this.newCommandaid;
      this.commanda.anagrafica_cliente = this.commandaw.anagrafica_cliente;
      this.commanda.idGiornata = this.idDay;
      this.commanda.numTavolo = this.commandaw.numTavolo;
      this.commanda.numPersone = this.commandaw.numPersone;
      this.commanda.numProdotti =  this.newCommandanProdotti;
      this.commanda.importoProdotti = this.newCommandaiProdotti;
      this.commanda.importoCoperto = this.newCommandaCoperto * this.commandaw.numPersone;
      this.commanda.dtCommanda = new Date();
      this.commanda.stato = this.commandaw.stato;

      alert('pronto per scrivere nuova Commanda');
      await  this.commandaService.createCommanda(this.commanda).subscribe(
        response =>  {
          alert('creata nuova commanda - test');
        },
        error => {
        alert('Prodotto1-Detail  --loadManifestazione: ' + error.message);
        console.log(error);
        }
      )





    }
   */

}
