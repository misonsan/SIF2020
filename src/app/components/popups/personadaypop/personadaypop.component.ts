import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from '../../../classes/Persona';
import { Giornata } from '../../../classes/Giornata';
import { Truoloday } from '../../../classes/T_ruolo_day';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { PersonaService }  from './../../../services/persona.service';
import { GiornataService } from './../../../services/giornata.service';
import { CommandaService } from './../../../services/commanda.service';
import { TruolodayService } from './../../../services/truoloday.service';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-personadaypop',
  templateUrl: './personadaypop.component.html',
  styleUrls: ['./personadaypop.component.css']
})
export class PersonadaypopComponent implements OnInit {

  public persona: Persona;
  public giornata: Giornata;
  public ruoli: Truoloday[]=[];
  public ruolo: Truoloday;

  public title = "Selezione Ruoli Persone";

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

  public saveValueStd: boolean;
  public ruoloAttuale = '';
  public ruoloSelected = 0;
  public ruoloSearch = 0;
  public nRecRuoloSearch = 0;
  public selectedCorrect = false;
  public selectedUser: Persona;
  public editForm: FormGroup;
  public isLoading = false;
  public fase = '';
  public tipo = '';
  public interval = 'minutes';
  public mm = 0;
  public elabledCommande = false;

  constructor(public modal: NgbActiveModal,
              private personaService: PersonaService,
              private giornataService: GiornataService,
              private commandaService: CommandaService,
              private truolodayService: TruolodayService,
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
      this.title = 'Inserimento Giornata';
      this.fase = 'I';
     } else {
      this.title = 'Aggiornamento Ruolo Operativo';
      this.fase = 'M';
    }
    this.persona = this.selectedUser;   // salvo la manifestazione ricevuta.
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

  // recupero il ruolo attuale della persona
  this.loadRuoloActual(this.persona.idRuolo_Day);


// leggo i ruoli giornalieri
   this.truolodayService.getRuoli().subscribe(
    res => {
      this.ruoli = res['data'];
      this.nRec = res['number'];
      this.editForm = this.formBuilder.group({
        id: [this.selectedUser.id],
        cognome: [this.selectedUser.cognome],
        nome: [this.selectedUser.nome],
        dtGiornata: [this.giornata.dtGiornata],
        statoGiornata: [this.giornata.d_stato_giornata],
        statoUtenti: [this.giornata.d_stato_utenti],
        ruoloActual: [this.ruoloAttuale]
      });
    },
      error => {
      alert('GiornataPopup  -- setForm - errore: ' + error.message);
      console.log(error);
      this.type = 'error';
      this.Message = 'Errore in lettura ruoli' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
    });
// altri campi non abbinati a oggetto



/*
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
/*

   if (this.selectedUser.id === 0) {
      this.editForm = this.formBuilder.group({
      id: [this.selectedUser.id],
      idManifestazione: [this.selectedUser.idManifestazione],
      dataManif: [this.selectedUser.dtGiornata, Validators.required]
     });
   } else {
     this.giornataService.getLastGiornataidbyManif(this.selectedUser.id).subscribe(
      res => {
       this.giornata = res['data'];

      // const datepipe: DatePipe = new DatePipe('en-US');
      // const formattedDate = datepipe.transform(this.giornata.dtGiornata, 'dd/MM/yyyy')

       this.datepipe = new DatePipe('en-US');
       this.formattedDate = this.datepipe.transform(this.giornata.dtGiornata, 'dd/MM/yyyy');
       console.log('la data formattata è:' + this.formattedDate);


       this.editForm = this.formBuilder.group({
        id: [this.selectedUser.id],
        idManifestazione: [this.selectedUser.idManifestazione],
        dataManif: [this.selectedUser.dtGiornata, Validators.required],
        lastdata: [this.formattedDate]
        });
      },
      error => {
      alert('GiornataPopup  -- setForm - errore: ' + error.message);
      console.log(error);
      });

      */
   }


 async  loadRuoloActual(idRuolo_Day) {

  this.ruoloAttuale = 'Non determinato';
  await this.truolodayService.getRuolo(idRuolo_Day).subscribe(
    res => {
             this.ruolo = res['data'];
             this.ruoloAttuale = this.ruolo.d_ruolo_day;
    },
    error => {
            alert('GiornataPopup  -- loadRuoloActual - errore: ' + error.message);
            console.log(error);
            this.type = 'error';
            this.Message = 'Errore in lettura ruolo' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
      });
   }

onSubmit() {
  if (this.editForm.invalid ) {
    alert('form invalido');
  }
  if (this.isLoading ) {
    alert('is this.isLoading');
  }
  if (this.editForm.invalid || this.isLoading) {
     return;
   }
  this.isLoading = true;
  this.aggiornaPersona();
}

/*
async loadGiornatefromManif(idManif) {

  this.tipoRic = 'T';
  await  this.giornataService.getGiornateforManif(idManif,this.tipoRic).subscribe(
       response => {
         this.nRec = response['number'];
         this.aggiornaManifestazione(idManif,this.nRec);
     },
     error => {

        this.type = 'error';
        this.Message = 'Errore in loadGiornatefromManif' + '\n' + error.message;
        this.showNotification(this.type, this.message);
        alert('Manifestazione-Data  -- loadGiornatefromManif: ' + error.message);
        console.log(error);
        this.alertSuccess = false;
        this.Message = error.message;
     }
   );
}
 */ 


async aggiornaGiornata(id){

   this.elabledCommande = false;
   this.giornata.statoUtenti = 1;   //  imposto che eseguito aggiornamento personale
   this.giornata.key_utenti_operation = parseInt(localStorage.getItem('id'));

   if(this.giornata.statoMagazzino === 1 && this.giornata.statoUtenti === 1 && this.giornata.statoCassa === 1) {
    this.giornata.stato = 2;
    this.elabledCommande = true;
  } else {
    this.giornata.stato = 1;
  }

   await  this.giornataService.updateGiornata(this.giornata).subscribe(
    resp => {

      if(this.elabledCommande === true) {
          this.cancellaAllCommande();
      }
      this.isLoading = false;
      alert('effettuato aggiornamento stato persone su Giornata');
      this.type = 'success';
      this.Message = 'Aggiornamento Stato personale su giornata ' + this.giornata.dtGiornata + ' \n  eseguita con successo';
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

selectedRuolo(selectedValue: number) {
//  alert('ho selezionato:' + selectedValue);
  this.ruoloSelected = selectedValue;
  this.selectedCorrect = true;
  // controllo per i responsabili se già assegnati
  if(this.ruoloSelected == 1 || this.ruoloSelected == 2 || this.ruoloSelected == 3 || this.ruoloSelected == 4 || this.ruoloSelected == -1) {
  //  alert('verifico quanti già assegnati ');
    this.NumeroRuoliAssegnati(this.ruoloSelected);
    
/*
    if(this.NumeroRuoliAssegnati(this.ruoloSelected) > 0) {
      alert(' trovato persone con ruoli di responsabile assegnati');
      this.type = 'error';
      this.Message = 'Ruolo di Responsabile già assegnato';
      this.showNotification(this.type, this.Message); 
     }  */

    }
  }


  
//this.aggiornaGiornata(this.giornata.id);

async aggiornaPersona() {
 
      this.persona.idRuolo_Day = this.ruoloSelected;
      this.persona.key_utenti_operation = parseInt(localStorage.getItem('id'));
      await   this.personaService.updatePersona(this.persona).subscribe(
        resp => {
            if(resp['rc'] === 'OK') {
              this.ControllaSeselezionatiTutti();
            }
          // i messaggi li metto in aggiornamento manifestazione
         // this.isLoading = false;
         // alert('effettuato aggiornamento');
            this.type = 'success';
            this.Message = 'Aggiornamento Ruolo per ' + this.persona.cognome + ' \n  eseguita con successo';
            this.showNotification(this.type, this.Message);
            this.modal.close('Yes');
        },
        error => {
          alert(' aggiornaPersona');
          this.isLoading = false;
          console.log(error);
          this.type = 'error';
          this.Message = 'Errore agg.to Persona' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          this.alertSuccess = false;
        })
    }


async  ControllaSeselezionatiTutti() {
         this.ruoloSearch = 0;
         await  this.personaService.getPersoneforRuolo1(this.ruoloSearch).subscribe(
          resp => {
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


  async  NumeroRuoliAssegnati(ruoloSearch) {
        await  this.personaService.getPersoneforRuolo1(ruoloSearch).subscribe(
          resp => {
            this.nRecRuoloSearch = resp['number'];
        //    alert('numero di assegnazioni eseguite: ' + this.nRecRuoloSearch);
            if(this.nRecRuoloSearch  > 0) {
              this.selectedCorrect = false;
              this.type = 'error';
              this.Message = 'Ruolo di Responsabile già assegnato';
              this.showNotification(this.type, this.Message);
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
    
   





/*

    async updaDateManifestazione() {

      await  this.manifestazioneService.updateManifestazione(this.manifestazione).subscribe(
          resp => {
            this.isLoading = false;
            alert('effettuato aggiornamento');
            this.type = 'success';
            this.message = 'Cancellazione ' + this.giornata.dtGiornata + ' \n  eseguita con successo';
            this.showNotification(this.type, this.message);
            this.modal.close('Yes');
          },
          error => {
            alert(' sono in UpdateManifestazione');
            this.isLoading = false;
            console.log(error);
            this.type = 'error';
            this.Message = 'Errore updateManifestazione' + '\n' + error.message;
            this.showNotification(this.type, this.message);
            this.alertSuccess = false;
          })
      }

*/
}
