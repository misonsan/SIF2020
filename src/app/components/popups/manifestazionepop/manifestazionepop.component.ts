import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Manifestazione } from '../../../classes/Manifestazione';
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from "angular-notifier";


@Component({
  selector: 'app-manifestazionepop',
  templateUrl: './manifestazionepop.component.html',
  styleUrls: ['./manifestazionepop.component.css']
})
export class ManifestazionepopComponent implements OnInit {

 
  manif: Manifestazione;

  public title = "Gestione Manifestazione";

// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;
  faWindowClose = faWindowClose;
  faTrash = faTrash;

  // variabili per editazione messaggio
  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;
  public Message = '';
  public isSelected = false;

  public saveValueStd: boolean;
  public lastNumber = 0;
  public fase = '';
  
  public selectedUser: Manifestazione;
  public editForm: FormGroup;
  public isLoading = false;
  public fieldVisible = false;
  public title_OK = 'Registrazione Manifestazione';
  public title_KO = 'Registrazione in Errore';
  public messageTest1  = 'Operazione conclusa correttamente ';
  
  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public message = '';
  
  modalRef2: BsModalRef;   // per aprire la seconda popup di conferma cancellazione

	/**
	 * Notifier service
	 */
  // private notifier: NotifierService;


  constructor(public modal: NgbActiveModal,
              private manifestazioneService: ManifestazioneService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private notifier: NotifierService) { 
                this.notifier = notifier;
              }
     

  ngOnInit(): void {

    console.log('dati passati da chiamante: ' + this.selectedUser.id );
    alert('popup - OnInit');
    if(this.selectedUser.id === 0) {
      this.title = 'Inserimento Manifestazione';
      this.fase = 'I';
      this.fieldVisible = false;
    } else {
      this.title = 'Aggiornamento Manifestazione';
      this.fase = 'M';
      this.fieldVisible = true;
    }
    this.manif = this.selectedUser;   // salvo la manifestazione ricevuta.
    this.setForm();
  }

  get editFormData() { 
    return this.editForm.controls;
  }
  
  //  versione in cui gestisc solo la tabella
  private setForm() {
         // this.selectedUser = this.manifestazione;

          console.log(this.selectedUser);

          this.editForm = this.formBuilder.group({
            id: [this.selectedUser.id],
            buonopasto: [this.selectedUser.buonoPastoCommanda, Validators.required],
            desmanif: [this.selectedUser.descManif, Validators.required],
            coperto: [this.selectedUser.impCoperto, Validators.required],
            note: [this.selectedUser.noteManifestazione]
           });

  }



moreno() {
  alert('eseguo le modifiche');
}


  onSubmit() {
         alert(' sono in onSubmit');
         if (this.editForm.invalid ) {
          alert('form invalido');
        }
         if (this.isLoading ) {
          alert('is this.isLoading');
        }
         if (this.editForm.invalid || this.isLoading) {
           return;
         }
         alert(' sono in onSubmit - step_01');
         this.isLoading = true;
         if(this.selectedUser.id === 0) {
          alert(' sono in onSubmit - step_02');
          this.InsertManifestazione();
         } else {
            this.updateManifestazione();
         }
   }
 

 async  InsertManifestazione() {

   await   this.manifestazioneService.getLastManifestazioneid().subscribe(
      res => {
           this.selectedUser.id = res['number'] + 1;
           const date = new Date(); // had to remove the colon (:) after the T in order to make it work
           const year = date.getFullYear();
           this.manif = new Manifestazione();
           this.manif.id = this.selectedUser.id;
           this.manif.anno = year;
           this.manif.descManif = this.editFormData.desmanif.value;
           this.manif.impCoperto = this.editFormData.coperto.value;
           this.manif.buonoPastoCommanda = this.editFormData.buonopasto.value;
           this.manif.noteManifestazione = this.editFormData.note.value;
           this.manif.key_utenti_operation = parseInt(localStorage.getItem('id'));
           this.manifestazioneService.createManifestazione(this.manif).subscribe(
             x => {     
                 this.isLoading = false;
                 this.type = 'success';
                 this.message = 'Inserimento di ' +  this.manif.descManif + ' \n  eseguita con successo';
                 this.showNotification(this.type, this.message);
                 this.modal.close('Yes');
             },
             error => {
                 this.isLoading = false;
                 this.type = 'error';
                 this.Message = 'Errore Ins.to' + '\n' + error.message;
                 this.showNotification(this.type, this.message);
           });
        },
       error => {
            console.log(error);
            this.type = 'error';
            this.Message = 'Errore get Last day' + '\n' + error.message;
            this.showNotification(this.type, this.message);
         });

   }

   async updateManifestazione()  {

    this.manif.descManif = this.editFormData.desmanif.value;
    this.manif.impCoperto = this.editFormData.coperto.value;
    this.manif.buonoPastoCommanda = this.editFormData.buonopasto.value;
    this.manif.noteManifestazione = this.editFormData.note.value;
    await this.manifestazioneService.updateManifestazione(this.manif).subscribe(
      x => {
         this.isLoading = false;
         this.type = 'success';
         this.message = 'Aggiornamento di ' +  this.manif.descManif + ' \n  eseguita con successo';
         this.showNotification(this.type, this.message);
         this.modal.close('Yes');
    },
      error => {
    
        this.isLoading = false;
        console.log(error);
        this.type = 'error';
        this.Message  = 'Errore agg.to' + '\n' + error.message; 
        this.showNotification(this.type, this.message);
 //       this.alertSuccess = false;
      });
   }





   confirmDelete() {

    alert(' chiedo conferma per cancellare');
   }





   openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {id: 2, class: 'second' });
  }



  closeModal(modalId?: number){

    alert('idModal: ' + modalId);
    if(modalId == 2) {
    alert('premuto Annulla')
  }

    if(modalId == 1) {
    alert('premuto Conferma - opero la cncellazione e chiudo le form')
    this.modalService.hide();
  }




    alert('chiuso la seconda modal');
    this.modalService.hide(modalId);
  }


  // funziona   - da eliminare con bottone
  lancioEsito() {
    alert('provo a lanciare il popup con esito operazione');
    // mettere new notifica
   // this.toastr.success('test messaggio esito' , this.title_OK);

    this.type = 'success';
    this.message = 'operazione conclusa ok   \n  eseguita con successo';
    this.showNotification(this.type, this.message);



  }

/**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
  public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}



 /*
 //  versione nel caso debba gestire anche altre tabelle oltre alla tabella in corso
 private setForm() {
  this.selectedUser = this.commandawriga;       // <--------------------------------------------   
 
  // nel caso debba effettuare delle letture su altre tabelle non creare metodo dove leggo e poi compilo la form,
  // ma portare la lettura del service qui e su res =>  effettuare la compilazione della form   <-------  Importante ----->
  this.prodottoService.getProdotto(this.selectedUser.idProdotto).subscribe(
    res => {
        this.prodotto = res['data'];
        this.editForm = this.formBuilder.group({
          id: [this.selectedUser.id],
          qta: [this.selectedUser.qta, Validators.required],
          desprodotto: [this.selectedUser.descrizione_prodotto],
          prezzo: [this.selectedUser.prezzo_day],
          disponibile: [this.selectedUser.disponibile_Day]  
         });
       // console.log('ho letto il prodotto da editare: ' + this.selectedUser.idProdotto);
       // alert('ho letto il prodotto da editare: ' + this.selectedUser.idProdotto);
       },
    error => {
       alert('Prodotto1DetailPopup  -- setForm - errore: ' + error.message);
       console.log(error);
    });
}

*/




}
