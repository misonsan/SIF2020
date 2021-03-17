import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Prodotto } from '../../../classes/Prodotto';
import { Giornata } from '../../../classes/Giornata';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { GiornataService } from './../../../services/giornata.service';
import { ProdottoService }  from './../../../services/prodotto.service';
import { CommandaService } from './../../../services/commanda.service';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


interface EnableProd {
  value: string;
  dEnable: string;
}

@Component({
  selector: 'app-prodottodaypop',
  templateUrl: './prodottodaypop.component.html',
  styleUrls: ['./prodottodaypop.component.css']
})
export class ProdottodaypopComponent implements OnInit {

  public prodotto: Prodotto;
  public giornata: Giornata;
 
  public title = "Selezione Prodotto";

  //public user: User;

// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;
  faWindowClose = faWindowClose;

  // variabili per editazione messaggio
  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;
  public Message = '';
  public type = '';
  public isSelected = false;

  public condizioneMenu = '';
  public saveValueStd: boolean;
  public prodottoaMenuSelected = '';
  public selectedCorrect = false;
  public selectedUser: Prodotto;
  public editForm: FormGroup;
  public isLoading = false;
  public fase = '';
  public tipo = '';
  public aMenuSearch = '';
  public elabledCommande = false;
 

  public pathImage =  'assets/images/photoProducts/';
  public displayedImage = '';
  
  enabledProd: EnableProd[] = [
    {value: '?', dEnable: 'Selezionare'},
    {value: 'N', dEnable: 'Non a Menu'},
    {value: 'S', dEnable: 'A Menu'},
   ];

  constructor(public modal: NgbActiveModal,
              private prodottoService: ProdottoService,
              private giornataService: GiornataService,
              private commandaService: CommandaService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private notifier: NotifierService) {
                 this.notifier = notifier;
               }


  ngOnInit(): void {
    console.log('dati passati da chiamante: ' + this.selectedUser.id );
    // alert('popup - OnInit');
    if (this.selectedUser.id === 0) {
       this.title = 'Inserimento Prodotto';
       this.fase = 'I';
      } else {
       this.title = 'Aggiornamento Prodotto Giornaliero';
       this.fase = 'M';
     }
    this.prodotto = this.selectedUser;   // salvo la manifestazione ricevuta.
    this.displayedImage = this.pathImage + '0.jpg';
    this.saveValueStd = false;

    switch (this.prodotto.aMenu)  {
      case 'S':
        this.condizioneMenu = 'a Menu';
        break;
      case 'N':
        this.condizioneMenu = 'Non a Menu';
        break;
      case '*':
        this.condizioneMenu = 'non selezionato';
        break;
    }
    this.isLoading = false;
     //  console.log('popup-oninit - giornata.id' + this.giornata.id + ' manif - ' + this.giornata.idManifestazione + ' statoGiornata ' + this.giornata.stato);
    this.setForm();
  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

   console.log(this.selectedUser);
  // leggo lìultima giornata per la manifestazione selezionata.
  // se non ci sono lascio spazio in bianco anltrimenti edito la data
   //  da verificare se funziona 
  this.giornata = JSON.parse(localStorage.getItem("SanfraGiornata"));
  // alert('la giornata in uso è: ' + this.giornata.dtGiornata); 

// leggo i ruoli giornalieri
 
   this.editForm = this.formBuilder.group({
        id: [this.selectedUser.id],
        statoGiornata: [this.giornata.d_stato_giornata],
        statoMagazzino: [this.giornata.d_stato_magazzino],
        dtGiornata: [this.giornata.dtGiornata],
        descrizione_prodotto: [this.selectedUser.descrizione_prodotto],
        d_Tipologia: [this.selectedUser.d_Tipologia],
        d_Competenza: [this.selectedUser.d_Competenza],
        d_Categoria: [this.selectedUser.d_Categoria],
        disponibile_Day: [this.selectedUser.disponibile_Day],
        disponibile: [this.selectedUser.disponibile],
        prezzo_day: [this.selectedUser.prezzo_day],
        prezzo: [this.selectedUser.prezzo],
        condizioneMenu: [this.condizioneMenu]
        });
    } 

    onSubmit() {

    //  alert('sono a inizio onSubmit');
      if (this.editForm.invalid ) {
        alert('form invalido');
      }
      /*
      if (this.isLoading ) {
        alert('is this.isLoading');
      }
      if (this.editForm.invalid || this.isLoading) {
         return;
       } */
      this.isLoading = true;
      this.aggiornaProdottoDay();

   //   alert('-----------------   fine onSubmit');
    }


async    aggiornaProdottoDay()  {

      this.prodotto = this.editForm.value;
    //  this.prodotto.disponibile_Day = this.editFormData.disponibile_day.value;
    //  this.prodotto.prezzo_day = this.editFormData.prezzo_day.value;
      this.prodotto.aMenu =  this.prodottoaMenuSelected;
      this.prodotto.key_utenti_operation = parseInt(localStorage.getItem('id'));
      this.prodottoService.updateProdotto(this.prodotto).subscribe(
      resp => {
      /*
        if (resp['rc'] === 'OK') {
        alert('aggiornaProdGiorn - OK');
        this.ControllaSeselezionatiTutti();
      }  */
      this.isLoading = true;
      //        alert('effettuato aggiornamento prodotto giornaliero');
      this.type = 'success';
      this.Message = 'effettuato aggiornamento prodotto giornaliero ';
      this.showNotification(this.type, this.Message);
      this.ControllaSeselezionatiTutti();
      //        this.modal.close('Yes');
    },
    error => {
      alert(' sono in aggiornaProdottoDay');
      this.isLoading = false;
      console.log(error);
      this.type = 'error';
      this.Message = 'Errore aggiornaProdottoDay' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
    })

    }

async aggiornaGiornata(id){

   this.elabledCommande = false;
   this.giornata.statoMagazzino = 1;   //  imposto che eseguito aggiornamento personale
  
   this.giornata.key_utenti_operation = parseInt(localStorage.getItem('id'));
   if(this.giornata.statoUtenti === 1 && this.giornata.statoCassa === 1) {
      this.giornata.stato = 2;
      this.elabledCommande = true;
    } else {
      this.giornata.stato = 1;
    }

   await  this.giornataService.updateGiornata(this.giornata).subscribe(
    resp => {
      this.isLoading = true;
      if(this.elabledCommande === true) {
        this.cancellaAllCommande();
    }
 //     alert('effettuato aggiornamento stato Magazzino su Giornata');
      this.type = 'success';
      this.Message = 'Aggiornamento Stato Magazzino su giornata ' + this.giornata.dtGiornata + ' \n  eseguita con successo';
      this.showNotification(this.type, this.Message);
      this.modal.close('Yes');
    },
    error => {
      alert(' sono in aggiornaGiornata');
      this.isLoading = false;
      console.log(error);
      this.type = 'error';
      this.Message = 'Errore aggiornaGiornata' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
    })
}

// metdo da aggiornare con specifiche di Hidran
async cancellaAllCommande() {

  
  await   this.commandaService.deleteAll().subscribe(
       resp => {
 
       },
       error => {
         alert(' sono in DeleteAll (Commande)');
         this.isLoading = false;
         console.log(error);
         this.type = 'error';
         this.Message = 'Errore deleteAllCommande' + '\n' + error.message;
         this.showNotification(this.type, this.Message);
         this.alertSuccess = false;
       }
     );
 
 }

async  ControllaSeselezionatiTutti() {
  // verificare se selezionati tutti a menu o no menu
  alert('------------------ Controllaselezionatitutti ');
  this.aMenuSearch = '*';
  await  this.prodottoService.getProdottiforMenu(this.aMenuSearch).subscribe(
   resp => {

    alert('Controllaselezionatitutti: ' + resp['number']);
     if(resp['number'] === 0) {
       this.aggiornaGiornata(this.giornata.id);
     }
   },
   error => {
     alert(' ControllaSeselezionatiTutti');
     this.isLoading = false;
     console.log(error);
     this.type = 'error';
     this.Message = 'Errore ControllaSeselezionatiTutti ' + '\n' + error.message;
     this.showNotification(this.type, this.Message);
     this.alertSuccess = false;
   }); 
}

/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}




    closeModal(modalId?: number){

      alert('idModal: ' + modalId);
      if(modalId === 2) {
        alert('premuto Annulla su modalDelete')
      }
      if(modalId === 1) {
        alert('premuto Conferma dalla prima modal- opero la cncellazione e chiudo le form')
        this.modalService.hide();
      }
      alert('chiuso la seconda modal');
      this.modalService.hide(modalId);
      }

      selectedUtilizzo(selectedValue: string) {
    //      alert('ho selezionato:' + selectedValue);
          this.prodottoaMenuSelected = selectedValue;
          this.selectedCorrect = true;
        }


        onSaveValueStdChanged(value:boolean){
          this.saveValueStd = value;
  
      //    alert('esito checkbox: ' + value);
          if (value) {
            this.selectedUser.disponibile_Day = this.prodotto.disponibile;
            this.selectedUser.prezzo_day = this.prodotto.prezzo;
          } else {
            this.selectedUser.disponibile_Day = 0;
            this.selectedUser.prezzo_day = 0;
          }
          this.editForm = this.formBuilder.group({
            disponibile_Day: [this.selectedUser.disponibile_Day],
            prezzo_day: [this.selectedUser.prezzo_day]
            });
      }


// esempio 

/*    ------------------- setform()

   esempio di gestione dati con tabelle non relative alla tabella in esame 
   
   this.giornataService.getLastGiornataidbyManif(this.selectedUser.idManifestazione).subscribe(
    res => {
     this.giornata = res['data'];
     this.nRec = res['number'];
     if(this.nRec > 0) {
 //       this.fieldVisible = true;
        this.datepipe = new DatePipe('en-US');
        this.formattedDate = this.datepipe.transform(this.giornata.dtGiornata, 'dd/MM/yyyy');
        console.log('la data formattata è:' + this.formattedDate);
   
        this.editForm = this.formBuilder.group({
         id: [this.selectedUser.id],
         idManifestazione: [this.selectedUser.idManifestazione],
         dataManif: [this.selectedUser.dtGiornata, Validators.required],
         lastdata: [this.formattedDate]
         });
         } else {
             this.fieldVisible = false;
             this.editForm = this.formBuilder.group({
                id: [this.selectedUser.id],
                idManifestazione: [this.selectedUser.idManifestazione],
                dataManif: [this.selectedUser.dtGiornata, Validators.required]
               });
         }
    // const datepipe: DatePipe = new DatePipe('en-US');
    // const formattedDate = datepipe.transform(this.giornata.dtGiornata, 'dd/MM/yyyy')

    
    },
    error => {
    alert('GiornataPopup  -- setForm - errore: ' + error.message);
    console.log(error);
    });

*/


}
