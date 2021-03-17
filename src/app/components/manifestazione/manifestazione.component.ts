import { Component, Input, OnInit } from '@angular/core';
import { ManifestazioneService} from '../../services/manifestazione.service';
import { Manifestazione} from '../../classes/Manifestazione';
import { faUserEdit, faTrash, faInfo, faInfoCircle, faList } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// form popup per gestire la manifestazione
import { ManifestazionepopComponent } from './../../components/popups/manifestazionepop/manifestazionepop.component';
@Component({
  selector: 'tr[app-manifestazione]',
  templateUrl: './manifestazione.component.html',
  styleUrls: ['./manifestazione.component.css']
})
export class ManifestazioneComponent implements OnInit {



  // variabili passate dal componente padre
  @Input('manif-data') manif: Manifestazione;
  @Input('manif-prog') i: number;

  faUserEdit = faUserEdit;
  faTrash = faTrash;
  faInfo = faInfo;
  faInfoCircle = faInfoCircle;
  faList = faList;

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

  constructor(private manifService: ManifestazioneService,
              private route: Router,
              private modal: NgbModal) { }

  ngOnInit(): void {

     //   per gestire eventuale popup
     this.headerPopup = 'Registrazione Manifestazione';
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




  updateUser() {

    alert('Manifestazione UpdateUser - da fare')
   // this.route.navigate(['messe', this.messa.id, 'edit']);


  }

  showManifestazioneDetail() {
   // alert('visualizzo il dettaglio della manifestazione');
          this.route.navigate(['manif', this.manif.id]);



     //   alert('Messa-Data  ----  selezionato la messa e salvata  su localstorage: ' + this.messa.id);

 }
   // passare oggetto messa
   // this.route.navigate(['messa', this.messa.id]);

  //   metodo per conferma popup
  okconfirm() {
    // alert('metodo da fare');
  }


  // apro la form popup per gestire le variazioni
  showManifestazionePopup(manif: Manifestazione) {

    const ref = this.modal.open(ManifestazionepopComponent, {size:'lg'});
    ref.componentInstance.selectedUser = manif;
  
    ref.result.then(
      (yes) => {
        console.log('Click YES');
      },
      (cancel) => {
        console.log('click Cancel');
      }
    )
  

  }


}
