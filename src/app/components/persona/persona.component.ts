import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonaService} from '../../services/persona.service';
import { Persona} from '../../classes/Persona';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


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

  public nRec = 0;

  public utenteFedele = false;



  constructor(private personaService: PersonaService, private route: Router) { }

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


      this.onSelectUser.emit(this.persona);


     // alert('----- 2       dovrei aver passaato oggetto user al filglio (persone-detail' + this.persona.cognome);




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


}
