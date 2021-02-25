import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommandawrigaService} from '../../services/commandawriga.service';
import { Commandawriga } from '../../classes/Commandawriga';
import { faUserEdit, faTrash, faInfo, faInfoCircle, faMinus, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

// per aggiornare commandaw da popup
import { CommandawService } from './../../services/commandaw.service';
import { Commandaw } from '../../classes/Commandaw';

@Component({
  selector: 'tr[app-commandawriga]',
  templateUrl: './commandawriga.component.html',
  styleUrls: ['./commandawriga.component.css']
})
export class CommandawrigaComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('commandawriga-data') commandawriga: Commandawriga;
   @Input('commandawriga-prog') i: number;

 // passo dati a persona-detail
   @Output('onSelectProdotto') onSelectProdotto = new EventEmitter();

   // prod: Prodotto;
   faUserEdit = faUserEdit;
   faTrash = faTrash;
   faInfo = faInfo;
   faInfoCircle = faInfoCircle;
   faMinus = faMinus;
   faPlus = faPlus;
   faSave = faSave;

   // -----
   public textMessage1 = '';
   public textMessage2 = '';
   public textUser = '';
   public headerPopup = '';
   public perDebug = 'Prodotto passato: ';
   public Message = '';
   public presenti = false;
   public isVisible = false;
   public alertSuccess = false;

   public nRec = 0;
    // variabili per editazione messaggio

    public savechange = false;
    public nRecMan = 0;

    public trovatoRec = false;
    public isSelected = false;

    public saveValueStd:boolean;

    public commandaw: Commandaw;
    public commandawriga1: Commandawriga;

    public newCommandaid = 0;
    public newCommandanProdotti = 0;
    public newCommandaiProdotti = 0;
    public newCommandaCoperto = 0;
    public idDay = 0;

   public pathImage =  'assets/images/photoProducts/';

   public displayedImage = '';

   constructor(private commandawrigaService: CommandawrigaService, private route: Router, private commandawService: CommandawService) { }

   ngOnInit(): void {

      //   per gestire eventuale popup
      this.headerPopup = 'Registrazione Prodotti';
      this.textMessage1 = '?????????? ';
   //   this.textUser = this.messa.demessa;
      this.textMessage2 = 'Registrazione non possibile';

  //  per visualizzazione in popup
  this.isVisible = false;
  this.isSelected = false;
  this.displayedImage = this.pathImage + '0.jpg';
  this.saveValueStd = false;
  this.Message = '';



   }

  showDetail() {
   // non effettuo una navigazione a altro componente, ma passo una variabile a Persona-Detail
     //     this.route.navigate(['persona', this.persona.id]);


     this.onSelectProdotto.emit(this.commandawriga);


    // alert('----- 2       dovrei aver passaato oggetto user al filglio (persone-detail' + this.persona.cognome);

 }



 showPersonaDetailNew() {
   //alert('creato evento per passare utente: ' + this.persona.cognome);
   this.onSelectProdotto.emit(this.commandawriga);
   //alert(' ---- 2   creato evento per passare utente: ' + this.persona.cognome);
 }



  // passare oggetto messa
  // this.route.navigate(['messa', this.messa.id]);

 //   metodo per conferma popup
 okconfirm() {
   // alert('metodo da fare');
 }


//  -------------------------  visualizzazione dei dati del prodotto via form Modale
// via popup da errori starni nell'elenco - da perfezionare

/*
goProdottoModal(id: number)  {

  alert('ho selezionato: ' + id);
  this.loadCommandawrigaa(id);
}


async loadCommandawrigaa(id: number) {
     await this.commandawrigaService.getCommandawriga(id).subscribe(
         response => {
           this.commandawriga = response['data'];
         },
         error => {

         alert('Commandawriga  per popup --LoadCommandawriga: ' + error.message);
         console.log(error);
         }
       )

  }

  tolgoProdotti() {
    this.commandawriga.qta = this.commandawriga.qta - 1;
   }

   aggiungoProdotti() {
      this.commandawriga.qta = this.commandawriga.qta + 1;
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

*/


}
