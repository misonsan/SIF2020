
import { Component, Input, OnInit } from '@angular/core';
import { ProdottoService} from '../../services/prodotto.service';
import { Prodotto} from '../../classes/Prodotto';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
// da fare
//import { ProdottopopComponent } from './../../components/popups/prodottopop/prodottodaypop.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'tr[app-prodotto-anag]',
  templateUrl: './prodotto-anag.component.html',
  styleUrls: ['./prodotto-anag.component.css']
})
export class ProdottoAnagComponent implements OnInit {

  // variabili passate dal componente padre
  @Input('prodotto-data') prodotto: Prodotto;
  @Input('prodotto-prog') i: number;



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

 

/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}


showProdottoDetailPopup() {
  alert('da fare dopo aver fatto la popup');
}


/*
showProdottoDetailPopup() {

 // fare una verifica se effettuata la modifica di tutti i prodotti.
     // se effettuati visualizzare messaggio e inibire l'operatività sul prodotto

   


  if(this.functionEnabled == false) {
    this.type = 'error';
    this.Message = 'Aggiornamento completato per tutti i prodotti ' + '--  funzione non eseguibile';
    this.showNotification(this.type, this.Message);
    return;
  }
  
  const ref = this.modal.open(ProdottopopComponent, {size:'lg'});
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
*/



 // passare oggetto messa
 // this.route.navigate(['messa', this.messa.id]);

//   metodo per conferma popup
okconfirm() {
  // alert('metodo da fare');
}
}
