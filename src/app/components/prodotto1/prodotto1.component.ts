import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProdottoService} from '../../services/prodotto.service';
import { Prodotto} from '../../classes/Prodotto';
import { Commandawriga } from '../../classes/Commandawriga';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'tr[app-prodotto1]',
  templateUrl: './prodotto1.component.html',
  styleUrls: ['./prodotto1.component.css']
})
export class Prodotto1Component implements OnInit {

  // variabili passate dal componente padre
  @Input('prodotto1-data') prodotto: Prodotto;
  @Input('prodotto1-prog') i: number;

// passo dati a persona-detail
  @Output('onSelectProdotto') onSelectProdotto = new EventEmitter();
  @Output('onSelectCommandawriga') onSelectCommandawriga = new EventEmitter();

  // prod: Prodotto;
  faUserEdit = faUserEdit;
  faTrash = faTrash;
  faInfo = faInfo;
  faInfoCircle = faInfoCircle;

  commandawriga: Commandawriga;

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


  constructor(private prodottoService: ProdottoService, private route: Router) { }

  ngOnInit(): void {

     //   per gestire eventuale popup
     this.headerPopup = 'Registrazione Prodotti';
     this.textMessage1 = '?????????? ';
  //   this.textUser = this.messa.demessa;
     this.textMessage2 = 'Registrazione non possibile';


  }

 showDetail() {
  // non effettuo una navigazione a altro componente, ma passo una variabile a Persona-Detail
    //     this.route.navigate(['persona', this.persona.id]);


    this.onSelectProdotto.emit(this.prodotto);
    // passo la seconda viarbile che è un'istanza vuota di commandawriga
    this.commandawriga = new Commandawriga();
    this.onSelectCommandawriga.emit(this.commandawriga);


   // alert('----- 2       dovrei aver passaato oggetto user al filglio (persone-detail' + this.persona.cognome);

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
