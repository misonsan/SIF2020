import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata} from '../../classes/Giornata';
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GiornatapopComponent } from './../../components/popups/giornatapop/giornatapop.component';

@Component({
  selector: 'app-manifestazione-data',
  templateUrl: './manifestazione-data.component.html',
  styleUrls: ['./manifestazione-data.component.css']
})
export class ManifestazioneDataComponent implements OnInit {

  public d_manifestazione: string;
  public data_inizio = new Date();
  public data_fine = new Date();
  public title = "elenco giornate Manifestazione";
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;

  public giornate: Giornata[] = [];
  public giornata: Giornata;
  public manif: Manifestazione;
  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;
  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';

  options = [
    'Tutte',
    'Aperta',
    'Non Aperta',
    'Chiusa',
    'Estinta'
  ];

  public Message = '';
  public isVisible = false;
  public alertSuccess = false;

//  posso aprire la popoup con dimensioni diverse:
//  this.modal.open(modalProdotto,{size:'sm'});    <----  piccola
//  this.modal.open(modalProdotto,{size:'lg'});    <----  ampia
//  this.modal.open(modalProdotto,{size:'xl'});    <----  grandissima

  constructor(private manifService: ManifestazioneService,
              private giornataService: GiornataService,
              private route: ActivatedRoute,
              private router: Router,
              private modal: NgbModal) { }

  ngOnInit(): void {
    this.tipoRichiesta = "T";

    this.validSearch = false;
    this.route.paramMap.subscribe(p => {
      // leggo i dati della messa
      this.loadManifestazione(+p.get('id'));
          // -------  leggo tutte le giornate per la manifestazione selezionata
          this.loadGiornatefromManif(+p.get('id'), this.tipoRichiesta);  // versione con ricerca filtrata per messa e tipo
      });
  }

// recupero i dati della messa
async loadManifestazione(id: number) {
  await  this.manifService.getManifestazione(id).subscribe(
   response => {
       this.manif = response['data'];
   },
   error => {
      alert('Manif-Data  --loadManifestazione: ' + error.message);
      console.log(error);
   }
 )

}

// metodo fatto da Moreno per selezionare le giornate della manifestazione

async loadGiornatefromManif(id: number, tipoRic: string) {

   this.trovatoRec = false;
   this.isVisible = true;
   await  this.giornataService.getGiornateforManif(id,tipoRic).subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      response => {
          this.giornate = response['data'];
          this.nRec = response['number'];
          this.textMessage = response['message'];
          this.trovatoRec = true;
          this.alertSuccess = true;
          this.Message = 'Situazione Attuale - Nessuna giornata presente per il tipo di richiesta';
          if(this.nRec > 0){
            this.Message = 'Situazione Attuale';
          }

       //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
       //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
      },
      error => {
         alert('Manifestazione-Data  -- loadGiornatefromManif: ' + error.message);
         console.log(error);
         this.alertSuccess = false;
         this.Message = error.message;
      }
    )
}


registra() {

alert('apro popup per registrazione giornata')
  // metodo utilizzando il componente manifestazione-Detail

  // localStorage.setItem("gestioneutente", 'new');
  // this.router.navigate(['giornataManif', this.manif.id, 'new']);


  // dal 05/03/2021  gestione con popup    {size:'lg'});
  this.giornata = new Giornata();
  this.giornata.idManifestazione = this.manif.id;
  const ref = this.modal.open(GiornatapopComponent, {size:'lg'});
  ref.componentInstance.selectedUser = this.giornata;

  ref.result.then(
    (yes) => {
      console.log('Click YES');
    },
    (cancel) => {
      console.log('click Cancel');
    }
  )

}


// imposto il filtro di ricerca dei fedeli
onSelectionChange(timanif: string)   {
  this.tipoRichiesta = timanif.substring(0,1);
// per impostare il campo corretto di ricerca per i fedele entrati
  this.validSearch = true;
  this.loadGiornatefromManif(this.manif.id, this.tipoRichiesta);
}



}

