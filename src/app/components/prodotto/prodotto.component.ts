import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProdottoService} from '../../services/prodotto.service';
import { Prodotto} from '../../classes/Prodotto';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ProdottodaypopComponent } from './../../components/popups/prodottodaypop/prodottodaypop.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'tr[app-prodotto]',
  templateUrl: './prodotto.component.html',
  styleUrls: ['./prodotto.component.css']
})
export class ProdottoComponent implements OnInit {

  // variabili passate dal componente padre
  @Input('prodotto-data') prodotto: Prodotto;
  @Input('prodotto-prog') i: number;

// passo dati a persona-detail
  @Output('onSelectProdotto') onSelectProdotto = new EventEmitter();

  // prod: Prodotto;
  faUserEdit = faUserEdit;
  faTrash = faTrash;
  faInfo = faInfo;
  faInfoCircle = faInfoCircle;

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
  public aMenuSearch = '';
  public functionEnabled = false;


  public type = '';

  public nRec = 0;


  constructor(public modal: NgbModal,
              private prodottoService: ProdottoService,
              private route: Router,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }

  ngOnInit(): void {

     //   per gestire eventuale popup
     this.headerPopup = 'Registrazione Prodotti';
     this.textMessage1 = '?????????? ';
  //   this.textUser = this.messa.demessa;
     this.textMessage2 = 'Registrazione non possibile';

  }

  async  ControllaSeselezionatiTutti() {
    // verificare se selezionati tutti a menu o no menu
    alert('------------------ Controllaselezionatitutti ');
    this.aMenuSearch = '*';
    await  this.prodottoService.getProdottiforMenu(this.aMenuSearch).subscribe(
     resp => {
  
      alert('Controllaselezionatitutti: ' + resp['number']);
      if(resp['number'] === 0) {
         this.functionEnabled = false;
       } else {
        this.functionEnabled = true;
       }
     },
     error => {
       alert(' ControllaSeselezionatiTutti');
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


 showDetail() {
  // non effettuo una navigazione a altro componente, ma passo una variabile a Persona-Detail
    //     this.route.navigate(['persona', this.persona.id]);


    this.onSelectProdotto.emit(this.prodotto);


   // alert('----- 2       dovrei aver passaato oggetto user al filglio (persone-detail' + this.persona.cognome);

}

showProdottoDetailPopup() {

 // fare una verifica se effettuata la modifica di tutti i prodotti.
     // se effettuati visualizzare messaggio e inibire l'operatività sul prodotto

     this.ControllaSeselezionatiTutti();


  if(this.functionEnabled == false) {
    this.type = 'error';
    this.Message = 'Aggiornamento completato per tutti i prodotti ' + '--  funzione non eseguibile';
    this.showNotification(this.type, this.Message);
    return;
  }
  
  const ref = this.modal.open(ProdottodaypopComponent, {size:'lg'});
  ref.componentInstance.selectedUser = this.prodotto;
  
  ref.result.then(
      (yes) => {
        console.log('Click YES');
      },
      (cancel) => {
        console.log('click Cancel');
      }
    );
}



showPersonaDetailNew() {
  //alert('creato evento per passare utente: ' + this.persona.cognome);
  this.onSelectProdotto.emit(this.prodotto);
  //alert(' ---- 2   creato evento per passare utente: ' + this.persona.cognome);
}



 // passare oggetto messa
 // this.route.navigate(['messa', this.messa.id]);

//   metodo per conferma popup
okconfirm() {
  // alert('metodo da fare');
}

}

