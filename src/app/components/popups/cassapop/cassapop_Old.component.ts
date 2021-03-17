import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faPlusSquare, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Giornata } from '../../../classes/Giornata';
import { Cassaw } from '../../../classes/Cassaw';
import { GiornataService } from './../../../services/giornata.service';
import { CassawService } from './../../../services/cassaw.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-cassapop',
  templateUrl: './cassapop.component.html',
  styleUrls: ['./cassapop.component.css']
})
export class CassapopComponent implements OnInit {

  public giornata: Giornata;
  public cassaw: Cassaw;

  public title = 'Gestione Cassa';

// icone
  faPlusSquare = faPlusSquare;
  faUndo = faUndo;
  faSave = faSave;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faInfoCircle = faInfoCircle;
  faTrashAlt = faTrashAlt;
  faHandPointLeft = faHandPointLeft;
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

  public selectedUser: Cassaw;
  public editForm: FormGroup;
  public isLoading = false;
  public fieldVisible = false;
  public tipoRic = '';
  public tipoGiornata = '';
  public valore = 0;
  public idManif = 0;
  public totaleCassa = 0;
  public totaleCassaBefore = 0;
  public enabledSalva = false;

   // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public message = '';

  modalRef2: BsModalRef;   // per aprire la seconda popup di conferma cancellazione

  constructor(public modal: NgbActiveModal,
              private giornataService: GiornataService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private cassawService: CassawService,
              private notifier: NotifierService) {
                 this.notifier = notifier;
               }


  ngOnInit(): void {

    this.cassaw = this.selectedUser;   // salvo la manifestazione ricevuta.

    alert('cassaw Passata: id: ' + this.selectedUser.id);


    this.giornata = new Giornata();
    this.loadGiornata(this.selectedUser.idDay);
    this.enabledSalva = false;

    console.log('dati passati da chiamante: ' + this.selectedUser.id );


    switch (this.giornata.statoCassa) {

      case 0:
      case 1:
        this.title = 'Cassa Iniziale del ';
        this.selectedUser.i100 = this.giornata.i100;
        this.selectedUser.i050 = this.giornata.i050;
        this.selectedUser.i020 = this.giornata.i020;
        this.selectedUser.i010 = this.giornata.i010;
        this.selectedUser.i005 = this.giornata.i005;
        this.selectedUser.monete = this.giornata.icontante;
    
        this.selectedUser.totale = (this.selectedUser.i100 * 100) +
                                   (this.selectedUser.i050 * 50) +
                                   (this.selectedUser.i020 * 20) +
                                   (this.selectedUser.i010 * 10) +
                                   (this.selectedUser.i005 * 5) +
                                   (this.selectedUser.monete * 1);
        this.totaleCassa =  this.selectedUser.totale;
        break;
      case 2:
        this.title = 'Cassa Finale del';
        this.selectedUser.i100 = 0;
        this.selectedUser.i050 = 0;
        this.selectedUser.i020 = 0;
        this.selectedUser.i010 = 0;
        this.selectedUser.i005 = 0;
        this.selectedUser.monete = 0;
        break;
      default:
        this.title = 'Cassa in fase non definita ' + this.giornata.statoCassa;
        break;
    }


    console.log('popup-oninit - giornata.id' + this.giornata.id + ' statoGiornata ' + this.giornata.stato + ' statoCassa ' + this.giornata.statoCassa);
    this.setForm();

  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

   console.log(this.selectedUser);
   this.selectedUser.totale = (this.selectedUser.i100 * 100) +
                              (this.selectedUser.i050 * 50) +
                              (this.selectedUser.i020 * 20) +
                              (this.selectedUser.i010 * 10) +
                              (this.selectedUser.i005 * 5) +
                              (this.selectedUser.monete * 1);

                              

   this.editForm = this.formBuilder.group({
         id: [this.selectedUser.id],
         i100: [this.selectedUser.i100, [
          Validators.required,
          Validators.pattern(
            /[0-9]{2,3}/
          )
        ]],
         i100Valore: [this.selectedUser.i100 * 100] ,
         i050: [this.selectedUser.i050],
         i050Valore: [this.selectedUser.i050 * 50],
         i020: [this.selectedUser.i020],
         i020Valore: [this.selectedUser.i020 * 20] ,
         i010: [this.selectedUser.i010],
         i010Valore: [this.selectedUser.i010 * 10],
         i005: [this.selectedUser.i005],
         i005Valore: [this.selectedUser.i005 * 5],
         monete: [this.selectedUser.monete * 1],
         totale: [this.selectedUser.totale],
         });

    }

    onSubmit() {

      console.log(this.editForm.value);
      return;



      if (this.editForm.invalid ) {
        alert('form invalido');
      }
      if (this.isLoading ) {
        alert('is this.isLoading');
      }
      if (this.editForm.invalid || this.isLoading) {
         return;
       }
        alert('------->   sto per aggiornare Cassaw');
       this.aggiornaCassaw();


      // aggiorno poi da Cassaw 
     // this.aggiornaCassadelGiorno();

    }

    aggiornaCassaw() {

      this.cassaw = this.editForm.value;

      console.log('--------------   sto per fare aggiornaCassaw -- ho copiato editform su cassaw');
      console.log('1: ' + this.cassaw.id);
      console.log('2: ' + this.cassaw.idDay);
      console.log('3: ' + this.cassaw.i100);
      console.log('4: ' + this.cassaw.i050);
      console.log('5: ' + this.cassaw.i020);
      console.log('6: ' + this.cassaw.i010);
      console.log('7: ' + this.cassaw.i005);
      console.log('8: ' + this.cassaw.monete);
      console.log('9: ' + this.cassaw.i100Valore);
      console.log('10: ' + this.cassaw.i050Valore);
      console.log('11: ' + this.cassaw.i020Valore);
      console.log('12: ' +  this.cassaw.i010Valore);
      console.log('13: ' + this.cassaw.i005Valore);
      console.log('14: ' + this.cassaw.totale);
      
   



      this.cassawService.updateCassa(this.editForm.value).subscribe(x => {
        this.isLoading = false;
        this.modal.close('Yes');
      },
        error => {

          alert(' sono in aggiornaCassaw');
          this.isLoading = false;
          console.log(error);
          this.type = 'error';
          this.Message = 'Errore aggiornaCassaw' + '\n' + error.message;
          this.showNotification(this.type, this.message);
          this.alertSuccess = false;


          this.isLoading = false;
        });
    }




    aggiornaCassadelGiorno() {

      alert(' ----------------------- aggiorna cassa del giorno');

      if(this.giornata.statoCassa === 0  || this.giornata.statoCassa === 1) {
        this.giornata.statoCassa = 1;
        if(this.giornata.statoMagazzino === 1  && this.giornata.statoUtenti === 1) {
          this.giornata.stato = 2;
        } else {
          this.giornata.stato = 1;
        }
                 
        alert('aggCassa - i005' + this.editForm.controls['i005'].value);


        this.giornata.i005 = this.editFormData.i005.value;
        this.giornata.i005Valore = this.editFormData.i005.value * 5;
        this.giornata.i010 = this.editFormData.i010.value;
        this.giornata.i010Valore = this.editFormData.i010.value * 10;
        this.giornata.i020 = this.editFormData.i020.value;
        this.giornata.i020Valore = this.editFormData.i020.value * 20;
        this.giornata.i050 = this.editFormData.i050.value;
        this.giornata.i050Valore = this.editFormData.i050.value * 50;
        this.giornata.i100 = this.editFormData.i100.value;
        this.giornata.i100Valore = this.editFormData.i100.value * 100;
        this.giornata.icontante = this.editFormData.monete.value;
      }
      if(this.giornata.statoCassa === 2) {
        this.giornata.statoCassa = 3;
        this.giornata.f005 = this.editFormData.i005.value;
        this.giornata.f005Valore = this.editFormData.i005.value * 5;
        this.giornata.f010 = this.editFormData.i010.value;
        this.giornata.f010Valore = this.editFormData.i010.value * 10;
        this.giornata.f020 = this.editFormData.i020.value;
        this.giornata.f020Valore = this.editFormData.i020.value * 20;
        this.giornata.f050 = this.editFormData.i050.value;
        this.giornata.f050Valore = this.editFormData.i050.value * 50;
        this.giornata.f100 = this.editFormData.i100.value;
        this.giornata.f100Valore = this.editFormData.i100.value * 100;
        this.giornata.fcontante = this.editFormData.monete.value;
      }
      this.giornata.key_utenti_operation = parseInt(localStorage.getItem('id'));
      this.updaCassaGiornata();

    }

    async updaCassaGiornata() {

      await  this.giornataService.updateGiornata(this.giornata).subscribe(
          resp => {
              // i messaggi di conclusione spostati su function chiamante
          },
          error => {
            alert(' sono in UpdateCassaGiornata');
            this.isLoading = false;
            console.log(error);
            this.type = 'error';
            this.Message = 'Errore UpdateCassaGiornata' + '\n' + error.message;
            this.showNotification(this.type, this.message);
            this.alertSuccess = false;
          })
      }

  async loadGiornata(id) {

 alert('------------------------------------  sto facendo LoadGiornata per id: ' + id);

 await  this.giornataService.getGiornata(id).subscribe(
      response => {
        this.giornata = response['data'];
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

  /**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}


openModal2(template: TemplateRef<any>) {

    this.modalRef2 = this.modalService.show(template, {id: 2, class: 'second' });

  }

    closeModal(modalId?: number){

  //    alert('idModal: ' + modalId);
      if(modalId === 2) {
  //      alert('premuto Annulla su modalDelete')
      }
      if(modalId === 1) {
        alert('premuto Conferma dalla prima modal- opero la cncellazione e chiudo le form')
        this.modalService.hide();
      }
      if(modalId === 3) {
  //       alert('premuto Conferma registrazione cassa dalla seconda formModal - opero la creazione cassa/aggiorno stato su giornata e chiudo le form')
       //  eseguo la registrazione della cassa
        // aggiorno lo stato su giornata


         this.onSubmit();
         this.enabledSalva = false;
         this.modalService.hide(3);
         this.modalService.hide(2);
         this.type = 'success';
         this.Message = 'Registrazione ' + this.title + ' eseguita correttamente';
         this.showNotification(this.type, this.Message);


      } 
      alert('chiuso la seconda modal');
      this.modalService.hide(modalId);
    }

/*
    modificato(tipo,num) {
      alert('ho modificato per il campo ' + tipo + ' numero pezzi:' + num);
    }

*/

focusOutFunction(tipo: string,event: any) {
  // alert('ho modificato per il campo ' + tipo + ' numero pezzi:' + event.target.value);

 

 // this.totaleCassa = this.formBuilder.control(['totale']).value;

 
 // alert('merdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + this.totaleCassa);

  this.totaleCassaBefore = this.totaleCassa;
  switch (tipo) {

    case 'i100':
      this.valore  = event.target.value * 100;
      this.totaleCassa = this.totaleCassa + this.valore;
      this.enabledSalva = true;
      this.editForm = this.formBuilder.group({
      i100Valore: [event.target.value * 100],
      totale: [this.totaleCassa],
      });
      break;
    case 'i050':
      this.valore  = event.target.value * 50;
      this.totaleCassa = this.totaleCassa + this.valore;
      this.enabledSalva = true;
      this.editForm = this.formBuilder.group({
      i050Valore: [event.target.value * 50],
      totale: [this.totaleCassa],
      });
      break;
    case 'i020':
      this.valore  = event.target.value * 20;
      this.totaleCassa = this.totaleCassa + this.valore;
      this.enabledSalva = true;
      this.editForm = this.formBuilder.group({
      i020Valore: [event.target.value * 20],
      totale: [this.totaleCassa],
      });
      break;
    case 'i010':
      this.valore  = event.target.value * 10;
      this.totaleCassa = this.totaleCassa + this.valore;
      this.enabledSalva = true;
      this.editForm = this.formBuilder.group({
      i010Valore: [event.target.value * 10],
      totale: [this.totaleCassa],
      });
      break;
    case 'i005':
      this.valore  = event.target.value * 5;
      this.totaleCassa = this.totaleCassa + this.valore;
      this.enabledSalva = true;
      this.editForm = this.formBuilder.group({
      i005Valore: [event.target.value * 5],
      totale: [this.totaleCassa],
      });
      break;
    case 'monete':
      const aaa = event.target.value.replace(",",".");
      this.valore  = aaa * 1;
      this.totaleCassa = this.totaleCassa + this.valore;
      this.enabledSalva = true;
      this.editForm = this.formBuilder.group({
          totale: [this.totaleCassa],
          });
       break;
    }

}

// esempio che funziona    https://stackblitz.com/edit/angular-editform-egqagp?file=src%2Fapp%2Fapp.component.ts



}
