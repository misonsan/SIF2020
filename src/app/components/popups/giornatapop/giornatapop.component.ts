
// https://f3oall.github.io/awesome-notifications/      notification + belle fatte da icone awesome

/*

notify- Type:
'info'
'success'
'warning'
'error'

https://codepen.io/maheshambure21/pen/VYJQYG   esempio di popup  con solo css

*/

import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Giornata } from '../../../classes/Giornata';
import { Manifestazione } from '../../../classes/Manifestazione';
import { GiornataService } from './../../../services/giornata.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';
import { ManifestazioneService } from '../../../services/manifestazione.service';




@Component({
  selector: 'app-giornatapop',
  templateUrl: './giornatapop.component.html',
  styleUrls: ['./giornatapop.component.css'],
  providers: [DatePipe] 
})
export class GiornatapopComponent implements OnInit {

  giornata: Giornata;
  giornate: Giornata[] = [];
  manifestazione: Manifestazione;
  gior: Giornata;

  public title = 'Gestione Giornata';

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

  public selectedUser: Giornata;
  public editForm: FormGroup;
  public isLoading = false;
  public fieldVisible = false;
  public tipoRic = '';
  public tipoGiornata = '';

  public idManif = 0;

  // ------------------   variabili per controllo data

  public datepipe: DatePipe = new DatePipe('en-US');
  public formattedDate: string;

  public date1: Date;
  public date2: Date;
  
 
  public date1n: number;
  public date2n: number;

  public date1s: string;
  public date2s: string;
 

  // contrData
  public dt1: any;
  public dt2: any;
  public diffDays1: any;
  public diffDays2: any;




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
              private datePipe: DatePipe,
              private manifestazioneService: ManifestazioneService,
              private notifier: NotifierService) {
     this.notifier = notifier;
   }


  ngOnInit(): void {

   
    console.log('dati passati da chiamante: ' + this.selectedUser.id );
    alert('popup - OnInit');
    if (this.selectedUser.id === 0) {
      this.title = 'Inserimento Giornata';
      this.fase = 'I';
      this.tipoGiornata = 'ultima Giornata';
      this.fieldVisible = false;
    } else {
      this.title = 'Aggiornamento Giornata';
      this.fase = 'M';
      this.tipoGiornata = 'Giornata Selezionata';
      this.fieldVisible = true;
      if(this.selectedUser.stato !== 0) {
        this.fieldVisible = false;
      }


    }
    this.giornata = this.selectedUser;   // salvo la manifestazione ricevuta.
    console.log('popup-oninit - giornata.id' + this.giornata.id + ' manif - ' + this.giornata.idManifestazione + ' statoGiornata ' + this.giornata.stato);
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
  if(this.editFormData.dataManif.value === null || this.editFormData.dataManif.value === '') {
    this.type = 'error';
    this.Message = 'Selezionare la data';
    this.showNotification(this.type, this.message);
    return;
   }
  alert('il campo selezinato è: ' + this.editFormData.dataManif.value);


// inserire controlli sulle date - provato e non funzionano
  this.isLoading = true;
  if (this.selectedUser.id === 0) {
       this.inserisciGiornata();
   } else {
      this.aggiornaGiornata();
   }
  this.loadGiornatefromManif(this.selectedUser.idManifestazione);
}

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

async aggiornaManifestazione(id,nRec){

     alert('sto per upd_Manif - nrec:' + nRec + ' per manif ' + id);
     await  this.manifestazioneService.getManifestazione(id).subscribe(
    res => {
        this.manifestazione = res['data'];
        if(nRec === 0) {
          this.manifestazione.dtInizio = this.editFormData.dataManif.value;
          this.manifestazione.dtFine = this.editFormData.dataManif.value;
          alert('---------------- prima giornata della manifestazione');
        } else {
          this.manifestazione.dtFine = this.editFormData.dataManif.value;
          alert('---------------------------------------- altre giornate della manifestazione');
        }
        this.manifestazione.key_utenti_operation = parseInt(localStorage.getItem('id'));
        this.updaManifestazione();
      },
      error => {
        alert(' sono in AggiornaManifestazione');
        console.log(error);
        this.type = 'error';
        this.Message = 'Errore agg.to AggiornaManifestazione' + '\n' + error.message;
        this.showNotification(this.type, this.message);
        this.alertSuccess = false;
    });
}

async updaManifestazione() {

await  this.manifestazioneService.updateManifestazione(this.manifestazione).subscribe(
    resp => {
      this.isLoading = false;
      alert('effettuato aggiornamento');
      this.type = 'success';
      this.message = 'Aggiornamento di ' + this.giornata.dtGiornata + ' \n  eseguita con successo';
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

myDateParser(dateStr : string) : string {
  // 2018-01-01T12:12:12.123456; - converting valid date format like this

  let date = dateStr.substring(0, 10);
  let time = dateStr.substring(11, 19);
  let millisecond = dateStr.substring(20)

  let validDate = date + 'T' + time + '.' + millisecond;
  console.log(validDate)
  return validDate
}



inserisciGiornata() {
 
  this.giornataService.getLastGiornataid().subscribe(
    res => {
      this.selectedUser.id = res['number'] + 1;
      this.giornata = new Giornata();
      this.giornata.id = this.selectedUser.id;
      this.giornata.idManifestazione = this.selectedUser.idManifestazione;
      this.giornata.key_utenti_operation = parseInt(localStorage.getItem('id'));
      this.giornata.dtGiornata = this.editFormData.dataManif.value; // this.editFormData.dataManif.value;
  //    alert('dopo aver aggiornato manif ' + this.giornata.id +  ' la data è: ' + this.editFormData.dataManif.value  );

      this.giornataService.createGiornata(this.giornata).subscribe(
        x => {
          // i messaggi li metto in aggiornamento Manifestazione
         // this.isLoading = false;
         // this.type = 'success';
         // this.message = 'Inserimento giornata del  ' + this.giornata.dtGiornata + ' \n  eseguita con successo';
         // this.showNotification(this.type, this.message);
         // this.modal.close('Yes');
        },
        error => {
          alert('errore in creazione giornata ' + error.error.message);
          this.isLoading = false;
          this.type = 'error';
          this.Message = 'Errore Ins.to' + '\n' + error.message;
          this.showNotification(this.type, this.message);
        });
    },
    error => {
      this.isLoading = false;
      this.type = 'error';
      this.Message = 'Errore get Last day' + '\n' + error.message;
      this.showNotification(this.type, this.message);
    });
  }

async aggiornaGiornata() {
      this.giornata.idManifestazione = this.selectedUser.idManifestazione;
      this.giornata.dtGiornata = this.editFormData.dataManif.value;
      this.giornata.key_utenti_operation = parseInt(localStorage.getItem('id'));
      await   this.giornataService.updateGiornata(this.giornata).subscribe(
        resp => {
          // i messaggi li metto in aggiornamento manifestazione
         // this.isLoading = false;
         // alert('effettuato aggiornamento');
         // this.type = 'success';
         // this.message = 'Aggiornamento di ' + this.giornata.dtGiornata + ' \n  eseguita con successo';
         // this.showNotification(this.type, this.message);
         // this.modal.close('Yes');
        },
        error => {
          alert(' sono in onSubmit - step_04');
          this.isLoading = false;
          console.log(error);
          this.type = 'error';
          this.Message = 'Errore agg.to' + '\n' + error.message;
          this.showNotification(this.type, this.message);
          this.alertSuccess = false;
        })
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


    confirmDelete() {
    alert();
  }



  openModal2(template: TemplateRef<any>) {

  // se lo stato della giornata è <> 0 (sono in corso delle attività o la giornata è attiva) non permetto la cancellazione
      if(this.giornata.stato > 0) {
        this.type = 'error';
        this.Message = 'Giornata non cancellabile';
        this.showNotification(this.type, this.message);
      } else {
        this.modalRef2 = this.modalService.show(template, {id: 2, class: 'second' });
      }
   
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
      if(modalId === 3) {
        // alert('premuto Conferma Cancellazione dalla seconda formModal - opero la cncellazione e chiudo le form')
        // eseguo la cancellazione della giornata e
        // aggiorno le date di Manifestazione
        this.idManif = this.giornata.idManifestazione;
        this.cancellaGiornata(this.giornata);
        this.modalService.hide(3);
        this.modalService.hide(2);
      }
      alert('chiuso la seconda modal');
      this.modalService.hide(modalId);
    }


    cancellaGiornata(giornata: Giornata) {
      this.giornataService.deleteGiornata(giornata).subscribe(
        resp => {
          if(resp['rc'] === 'OK') {

            alert('ho rc di cancellazione OK');
            this.aggiornaDateManifestazione(this.idManif);
          }
        },
        error => {
          this.isLoading = false;
          console.log(error);
          this.type = 'error';
          this.Message = 'Errore cancellaGiornata' + '\n' + error.message;
          this.showNotification(this.type, this.message);
          this.alertSuccess = false;
        })
    }


async    aggiornaDateManifestazione(idManif) {
      this.tipoRic = 'T';
      
      await this.giornataService.getGiornateforManif(idManif, this.tipoRic).subscribe(
        res => {
             this.giornate = res['data'];
             for (var i = 0; i < this.giornate.length; i++) {
            // for(gior of this.giornate; let i = index) {      // let gior of this.giornate    -->  gior definita sopra
               if(i === 0) {
                 this.date1 = this.giornate[i].dtGiornata;
                 this.date2 = this.giornate[i].dtGiornata;
                } else {
                  this.date2 = this.giornate[i].dtGiornata;
                }
               
             }

            alert('ricrearo date inizio e fine: ' + this.date1 + ' fine: ' + this.date2);

             this.ricreaDateManifestazione(idManif, this.date1, this.date2);
            },
        error => {
            this.isLoading = false;
            console.log(error);
            this.type = 'error';
            this.Message = 'Errore aggiornaDateManifestazione' + '\n' + error.message;
            this.showNotification(this.type, this.message);
            this.alertSuccess = false;
           });
    }

 
 async   ricreaDateManifestazione(id, dt1, dt2) {

  await    this.manifestazioneService.getManifestazione(id).subscribe(
        res => {
             this.manifestazione = res['data'];
             this.manifestazione.dtInizio = dt1;
             this.manifestazione.dtFine = dt2;
             this.updaDateManifestazione();
             // effettuo visualizzazione del messaggio di rialliento date corretto
             this.type = 'success';
             this.message = 'Cancellata data e riallineate date su Manifestazione';
             this.showNotification(this.type, this.message);
             this.modal.close('Yes');
            },
        error => {
            this.isLoading = false;
            console.log(error);
            this.type = 'error';
            this.Message = 'Errore ricreaDateManifestazione' + '\n' + error.message;
            this.showNotification(this.type, this.message);
            this.alertSuccess = false;
           });


    }



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



/*
// non funziona
manipData() {


  // https://stackoverflow.com/questions/57784792/convert-string-to-date-in-angular-8
 // this.date2 = parse(this.editFormData.dataManif.value, 'd/M/yyyy HH:mm:ss', new Date());


 // const datePipe1 = this.datePipe.transform(this.editFormData.lastdata.value, 'dd/MM/yyyy');
 const datePipe1 = this.editFormData.lastdata.value;
 const datePipe2 = this.datePipe.transform(this.editFormData.dataManif.value, 'dd/MM/yyyy');
 alert('data manipolata: - last:' + datePipe1 + ' inserita: ' + datePipe2);

 //this.date2 = new Date(this.editFormData.dataManif.value);
 var pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

 //this.date1s = this.formatDate(this.editFormData.lastdata.value);
 this.date2s = this.formatDate(this.editFormData.dataManif.value);

this.date1 = this.editFormData.lastdata.value;

// this.date2s = this.editFormData.dataManif.value.match(pattern);
this.date2 = new Date(this.editFormData.dataManif.value);


alert('dopo conversione date:' + this.date1 +  ' -- date2  ' + this.date2)


 //alert('datePipe1: ' + datePipe1);
 //alert('data2: - last:' + this.date2);

 /*
 if(this.date2s < this.date1) {
  alert('data selezionata errata');
} else {
  alert('data selezionata corretta');
}


}  */


/*
// non funziona
formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('/');
}


// non funziona
contrDate() {

  const datex1 = new Date('26/02/2021');
  const datex2 = new Date('06/03/2021');

  alert('datex1:' + datex1);

  alert('d1-d2:' + this.getDifferenceInDays(datex1, datex2));
  console.log(' d1-d2 = ' + this.getDifferenceInDays(datex1, datex2));
  console.log('d2-d1: ' + this.getDifferenceInDays(datex2, datex1));




const dataoggi: any = new Date();
  alert('dataManif selezionata: ' + this.editFormData.dataManif.value);

  this.dt1 = this.editFormData.lastdata.value;
  this.dt2 = dataoggi;

  this.diffDays1 = Math.abs(this.dt1.getTime() - this.dt2.getTime());              Math.floor((this.dt2 - this.dt1) / (1000 * 60 * 60 * 24));
  this.diffDays2 = Math.floor((this.dt1 - this.dt2) / (1000 * 60 * 60 * 24));


  alert('differenza-1 lastData - data selezionata: ' + this.diffDays1);
  alert('differenza-2 data selezionata - lastData: ' + this.diffDays2);



}




// non funziona
getDifferenceInDays(date1, date2) {
  const dtx1 = new Date(date1);
const dtx2 = new Date(date2);
return Math.floor((Date.UTC(dtx2.getFullYear(), dtx2.getMonth(), dtx2.getDate()) - Date.UTC(dtx1.getFullYear(), dtx1.getMonth(), dtx1.getDate()) ) /(1000 * 60 * 60 * 24));
}

onSubmitOld() {
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
 

  alert('lastData: ' + this.editFormData.lastdata.value );

  this.formattedDate = this.datepipe.transform(this.editFormData.dataManif.value , 'dd/MM/yyyy');
 
  alert('data inserita: ' + this.editFormData.dataManif.value + ' --- ' + this.formattedDate);

 
  this.date1 = this.editFormData.lastdata.value;
  this.date2 = this.editFormData.dataManif.value; 


  const aa =  this.editFormData.lastdata.value.toDateString();   //this.datepipe.transform(this.editFormData.dataManif.value, 'dd/MM/yyyy');         
  this.date1s =  this.myDateParser(aa);


  alert('data1s: ' + this.date1s + ' ----  aa : ' + aa);




  this.date1n = Date.parse(this.editFormData.lastdata.value.toDateString());                                          // this.editFormData.lastdata.value;
  this.date2n = Date.parse(this.formattedDate);


  alert('data1n: ' + this.date1n);

  alert('----------------------- data2n: ' + this.date2n);



  if(this.date2n < this.date1n) {

  this.alertSuccess = false;
  this.isVisible = true;
  this.Message = ('date errate - 1' + this.date1 + ' 2'  + this.date2) ;

this.type = 'error';
this.message = 'date errate'; //'data selezionata minore di ultima data' + '\n Selezionare una data maggiore ultima insertita';
this.message = this.Message; 
this.showNotification(this.type, this.message);

// alert(' data selezionata minore di ultima data - errore');
} else {

this.alertSuccess = true;
this.isVisible = true;
this.Message = 'date errate';
alert('data selezionata corretta');
this.type = 'success';
this.message = 'date corrette '; //'data selezionata corretta' + '\n procedo a inserimento';
this.showNotification(this.type, this.message);
}

  return;




 
  alert('-------------    normalizzata data last: ' + this.date1 + ' date2 normalizzata parse: ' + this.date2n);
 // var dat2 = document.getElementById(this.editFormData.dataManif.value).value;
  this.date2 =  this.editFormData.dataManif.value;                                    //    new Date(this.formattedDate)
 //   alert('----------------------------------------- data inserita ' + date2);
  if(this.date2 < this.date1) {

    this.alertSuccess = false;
    this.isVisible = true;
    this.Message = ('date errate - 1' + this.date1 + ' 2'  + this.date2) ;

  this.type = 'error';
  this.message = 'date errate'; //'data selezionata minore di ultima data' + '\n Selezionare una data maggiore ultima insertita';
  this.message = this.Message; 
  this.showNotification(this.type, this.message);

 // alert(' data selezionata minore di ultima data - errore');
} else {

  this.alertSuccess = true;
  this.isVisible = true;
  this.Message = 'date errate';
  alert('data selezionata corretta');
  this.type = 'success';
  this.message = 'date corrette '; //'data selezionata corretta' + '\n procedo a inserimento';
  this.showNotification(this.type, this.message);
}
  

  return;
  this.isLoading = true;
  if (this.selectedUser.id === 0) {
        this.inserisciGiornata();
     } else {
        this.aggiornaGiornata();
     }
}
*/

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






/*


      closeModal(modalId ? : number) {
        alert() { }
      } + modalId));
if (modalId === 2) {
alert('premuto Annulla');
}

if (modalId === 1) {
alert('premuto Conferma - opero la cncellazione e chiudo le form');
this.modalService.hide();
}




alert('chiuso la seconda modal');
this.modalService.hide(modalId);
}

*/







}
