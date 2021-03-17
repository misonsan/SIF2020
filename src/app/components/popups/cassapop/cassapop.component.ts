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
import { CommandaService } from '../../../services/commanda.service';


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
  public elabledCommande = false;  // se giornata aperta cancello le vecchie commande e predispongo per emettere Commande

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
              private commandaService: CommandaService,
              private notifier: NotifierService) {
                 this.notifier = notifier;
               }


  ngOnInit(): void {

    this.cassaw = this.selectedUser;   // salvo la manifestazione ricevuta.


    

    alert('cassaw Passata: id: ' + this.selectedUser.id);

    this.enabledSalva = false;
    this.setForm();

  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

   console.log(this.selectedUser);
   switch (this.selectedUser.statoCassa) {

    case 0:
    case 1:
      this.title = 'Cassa Iniziale del ';
      this.selectedUser.totale = (this.selectedUser.i100 * 100) +
                                 (this.selectedUser.i050 * 50) +
                                 (this.selectedUser.i020 * 20) +
                                 (this.selectedUser.i010 * 10) +
                                 (this.selectedUser.i005 * 5) +
                                 (this.selectedUser.monete * 1);
      break;
    case 2:
      this.title = 'Cassa Finale del ';
      this.selectedUser.i100 = 0;
      this.selectedUser.i050 = 0;
      this.selectedUser.i020 = 0;
      this.selectedUser.i010 = 0;
      this.selectedUser.i005 = 0;
      this.selectedUser.monete = 0;
      this.selectedUser.totale = 0;
      break;
    default:
      this.title = 'Cassa in fase non definita ' + this.selectedUser.statoCassa;
      break;
  }


  console.log('popup-oninit - giornata.id' + this.selectedUser.id + ' statoCassa ' + this.selectedUser.statoCassa);

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
     

/*

      if (this.editForm.invalid ) {
        alert('form invalido');
      }
      if (this.isLoading ) {
        alert('is this.isLoading');
      }
      if (this.editForm.invalid || this.isLoading) {
         return;
       }
*/

        alert('------->   sto per aggiornare Cassaw');
       this.aggiornaCassaw();


      // aggiorno poi da Cassaw 
     // this.aggiornaCassadelGiorno();

    }

  async  aggiornaCassaw() {


     console.log(this.editForm.value);

     await  this.cassawService.updateCassa(this.editForm.value).subscribe(x => {
            this.cassaw = x['data'];
            this.UpdGiornataeCassa(this.selectedUser.idDay);
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


    aggiornaTempCassaw() {
      console.log(this.editForm.value);

      this.cassawService.updateCassa(this.editForm.value).subscribe(
        x => {
              this.cassaw = x['data'];
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

 async   aggiornaCassadelGiorno() {

      alert(' ----------------------- aggiorna cassa del giorno');
      this.elabledCommande = false;
      if(this.giornata.statoCassa === 0  || this.giornata.statoCassa === 1) {
        this.giornata.statoCassa = 1;
        if(this.giornata.statoMagazzino === 1  && this.giornata.statoUtenti === 1) {
          this.giornata.stato = 2;
          this.elabledCommande = true;
        } else {
          this.giornata.stato = 1;
        }

        alert('---------------------       cassaw.i100Valore: ' + this.cassaw.i010Valore);
        this.giornata.i005 = this.cassaw.i005;
        this.giornata.i005Valore = this.cassaw.i005Valore;
        this.giornata.i010 = this.cassaw.i010;
        this.giornata.i010Valore = this.cassaw.i010Valore;
        this.giornata.i020 = this.cassaw.i020;
        this.giornata.i020Valore = this.cassaw.i020Valore;
        this.giornata.i050 = this.cassaw.i050;
        this.giornata.i050Valore = this.cassaw.i050Valore;
        this.giornata.i100 = this.cassaw.i100;
        this.giornata.i100Valore = this.cassaw.i100Valore;
        this.giornata.icontante = this.cassaw.monete;
        // imposto gli stessi valori su cassa attuale
        this.giornata.a005 = this.cassaw.i005;
        this.giornata.a005Valore = this.cassaw.i005Valore;
        this.giornata.a010 = this.cassaw.i010;
        this.giornata.a010Valore = this.cassaw.i010Valore;
        this.giornata.a020 = this.cassaw.i020;
        this.giornata.a020Valore = this.cassaw.i020Valore;
        this.giornata.a050 = this.cassaw.i050;
        this.giornata.a050Valore = this.cassaw.i050Valore;
        this.giornata.a100 = this.cassaw.i100;
        this.giornata.a100Valore = this.cassaw.i100Valore;
        this.giornata.acontante = this.cassaw.monete;
      }
      if(this.giornata.statoCassa === 2) {
        this.giornata.statoCassa = 3;
        this.giornata.f005 = this.cassaw.i005;
        this.giornata.f005Valore = this.cassaw.i005Valore;
        this.giornata.f010 = this.cassaw.i010;
        this.giornata.f010Valore = this.cassaw.i010Valore;
        this.giornata.f020 = this.cassaw.i020;
        this.giornata.f020Valore = this.cassaw.i020Valore;
        this.giornata.f050 = this.cassaw.i050;
        this.giornata.f050Valore = this.cassaw.i050Valore;
        this.giornata.f100 = this.cassaw.i100;
        this.giornata.f100Valore = this.cassaw.i100Valore;
        this.giornata.fcontante = this.cassaw.monete;
      }
      this.giornata.key_utenti_operation = parseInt(localStorage.getItem('id'));
      await   this.updaCassaGiornata();
      // se aperta giornata, cancello le vecchie commande e mi predispongo a emetterle        <-------------   metodo da verificare con Hidran
      if(this.elabledCommande === true) {
          this.commandaService.deleteAll().subscribe(
            resp => {

            },
            error => {
              alert(' sono in DeleteAll (Commande)');
              this.isLoading = false;
              console.log(error);
              this.type = 'error';
              this.Message = 'Errore deleteAllCommande' + '\n' + error.message;
              this.showNotification(this.type, this.message);
              this.alertSuccess = false;
            }
          );
      }

    }

    async updaCassaGiornata() {

      await  this.giornataService.updateGiornata(this.giornata).subscribe(
          resp => {
              // i messaggi di conclusione spostati su function chiamante
              alert('-------  updaCassaGiornata - dopo update ');
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

  async UpdGiornataeCassa(id) {

 alert('------------------------------------  sto facendo LoadGiornata per id: ' + id);

 await  this.giornataService.getGiornata(id).subscribe(
      response => {
        this.giornata = response['data'];
        this.aggiornaCassadelGiorno();
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

 
    console.log('----- dopo compilazione campo ' + tipo +  ' per pezzi: ' + event.target.value);
    switch (tipo) {

      case 'i100':
        this.valore  = event.target.value * 100;
        this.totaleCassa = this.totaleCassa + this.valore;
        this.enabledSalva = true;
        this.editForm = this.formBuilder.group({
        i100: [event.target.value],
        i100Valore: [event.target.value * 100],
        totale: [this.totaleCassa],
        });
        break;
      case 'i050':
        this.valore  = event.target.value * 50;
        this.totaleCassa = this.totaleCassa + this.valore;
        this.enabledSalva = true;
        this.editForm = this.formBuilder.group({
        i050: [event.target.value],
        i050Valore: [event.target.value * 50],
        totale: [this.totaleCassa],
        });
        break;
      case 'i020':
        this.valore  = event.target.value * 20;
        this.totaleCassa = this.totaleCassa + this.valore;
        this.enabledSalva = true;
        this.editForm = this.formBuilder.group({
        i020: [event.target.value],
        i020Valore: [event.target.value * 20],
        totale: [this.totaleCassa],
        });
        break;
      case 'i010':
        this.valore  = event.target.value * 10;
        this.totaleCassa = this.totaleCassa + this.valore;
        this.enabledSalva = true;
        this.editForm = this.formBuilder.group({
        i010: [event.target.value],
        i010Valore: [event.target.value * 10],
        totale: [this.totaleCassa],
        });
        break;
      case 'i005':
        this.valore  = event.target.value * 5;
        this.totaleCassa = this.totaleCassa + this.valore;
        this.enabledSalva = true;
        this.editForm = this.formBuilder.group({
        i005: [event.target.value],
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
            monete: [this.valore],
            totale: [this.totaleCassa],
            });
         break;
      }
    this.aggiornaTempCassaw();
   
    this.totaleCassa = (this.cassaw.i100 * 100) +
                        (this.cassaw.i050 * 50) +
                        (this.cassaw.i020 * 20) +
                        (this.cassaw.i010 * 10) +
                        (this.cassaw.i005 * 5) +
                        (this.cassaw.monete * 1);


    /*
    console.log('mappa valorizzata: -------------> ' + this.editForm.value);
    this.cassaw = this.editForm.value;

   
    this.cassaw.i100Valore = this.cassaw.i100 * 100;
    this.cassaw.i050Valore = this.cassaw.i050 * 50;
    this.cassaw.i020Valore = this.cassaw.i020 * 20;
    this.cassaw.i010Valore = this.cassaw.i010 * 10;
    this.cassaw.i005Valore = this.cassaw.i005 * 5;
    this.cassaw.totale =  this.cassaw.i100Valore +
                          this.cassaw.i050Valore +
                          this.cassaw.i020Valore +
                          this.cassaw.i010Valore +
                          this.cassaw.i005Valore +
                          this.cassaw.monete;

    this.editForm = this.formBuilder.group({
      i100Valore: [this.cassaw.i100Valore] ,
      i050Valore: [this.cassaw.i050Valore],
      i020Valore: [this.cassaw.i020Valore] ,
      i010Valore: [this.cassaw.i010Valore],
      i005Valore: [this.cassaw.i005Valore],
      totale: [this.cassaw.totale],
      });

*/



}

// esempio che funziona    https://stackblitz.com/edit/angular-editform-egqagp?file=src%2Fapp%2Fapp.component.ts



}
