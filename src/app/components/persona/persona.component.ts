import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonaService} from '../../services/persona.service';
import { Persona} from '../../classes/Persona';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { PersonadaypopComponent } from './../../components/popups/personadaypop/personadaypop.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'tr[app-persona]',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  // variabili passate dal componente padre
  @Input('persona-data') persona: Persona;
  @Input('persona-prog') i: number;

// passo dati a persona-detail
  @Output('onSelectUser') onSelectUser = new EventEmitter();



  user: Persona;
  faUserEdit = faUserEdit;
  faTrash = faTrash;
  faInfo = faInfo;
  faInfoCircle = faInfoCircle;

// -----
  public textMessage1 = '';
  public textMessage2 = '';
  public textUser = '';
  public headerPopup = '';
  public perDebug = 'utente passato: ';
  public Message = '';
  public presenti = false;
  public isVisible = false;
  public alertSuccess = false;
  public funcSearch = 0;
  public nRec = 0;

  public type = '';
  public utenteFedele = false;
  public functionEnabled = false;


  constructor(public modal: NgbModal,
             private personaService: PersonaService,
             private route: Router,
             private notifier: NotifierService) {
              this.notifier = notifier;
            }

  ngOnInit(): void {

     //   per gestire eventuale popup
     this.headerPopup = 'Registrazione Persone';
     this.textMessage1 = '?????????? ';
  //   this.textUser = this.messa.demessa;
     this.textMessage2 = 'Registrazione non possibile';

    // this.loadManifestazioni();

  }


/*    metterlo su manifestazione-data  per editare le giornate della manifestazione

  async loadManifestazioni() {
    this.presenti = false;
    this.Message = 'Nessuna Manifestazione presente';

    await  this.manifService.getManifestazioni().subscribe(
      res => {
        if(res['number'] > 0) {
          this.nRec = res['number'];
          this.alertSuccess = true;
          this.isVisible = true;
          this.Message = 'Situazione attuale';
          this.manif = res['data'];
          console.log('trovate manifestazioni da editare in elenco');
          this.presenti = true;
          } else {
              this.isVisible = true;
              this.Message = 'Nessuna Manifestazione presente';
            }
      },
      err => {
        this.alertSuccess = false;
        this.isVisible = true;

        console.log(err);
        switch (err.status) {
           case 401:      //login
              this.Message = 'errore 401';
              break;
          case 403:     //forbidden
              this.Message = 'errore 403';
              break;
          case 404:      //login
              this.Message = 'errore 404';
              break;
          case 405:     //forbidden
              this.Message = 'errore 405';
              break;
          default:
              this.Message = err.status;
              break;
          }
     });


}
  */


   showPersonaDetail() {
    // non effettuo una navigazione a altro componente, ma passo una variabile a Persona-Detail
      //     this.route.navigate(['persona', this.persona.id]);

     // modalità di link con prima versione che prevedeva scambio tra componenti
    //   this.onSelectUser.emit(this.persona);

// modalità di aggiornamento tramite popup



  }


  showPersonaDetailPopup() {

    // verifico se ho già effettuato la conferma delle persone

    this.ControllaSeselezionatiTutti();


    if(this.functionEnabled == false) {
      this.type = 'error';
      this.Message = 'Aggiornamento completato per tutte le persone ' + '--  funzione non eseguibile';
      this.showNotification(this.type, this.Message);
      return;
    }



    const ref = this.modal.open(PersonadaypopComponent, {size:'lg'});
    ref.componentInstance.selectedUser = this.persona;
  
    ref.result.then(
      (yes) => {
        console.log('Click YES');
      },
      (cancel) => {
        console.log('click Cancel');
      }
    )

    }






  showPersonaDetailNew() {
    //alert('creato evento per passare utente: ' + this.persona.cognome);
    this.onSelectUser.emit(this.persona);
    //alert(' ---- 2   creato evento per passare utente: ' + this.persona.cognome);
  }



/*   non passo a nuovo componente, ma passo una variabile a componente
  showPersonaDetail() {
   // alert('visualizzo il dettaglio della manifestazione');
          this.route.navigate(['persona', this.persona.id]);



     //   alert('Messa-Data  ----  selezionato la messa e salvata  su localstorage: ' + this.messa.id);

 }
 */
   // passare oggetto messa
   // this.route.navigate(['messa', this.messa.id]);

  //   metodo per conferma popup
  okconfirm() {
    // alert('metodo da fare');
  }


  async  ControllaSeselezionatiTutti() {
    // verificare se selezionati tutti a menu o no menu
  //  alert('------------------ Controllaselezionatitutti ');
    this.funcSearch = 0;
    await  this.personaService.getPersoneforRuolo1(this.funcSearch).subscribe(
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


}
