import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata} from '../../classes/Giornata';
import { ActivatedRoute, Router } from '@angular/router';


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


  constructor(private manifService: ManifestazioneService,
              private giornataService: GiornataService,
              private route: ActivatedRoute,
              private router: Router) { }

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

  // passare il valore della messa selezionata

   localStorage.setItem("gestioneutente", 'new');
   this.router.navigate(['giornataManif', this.manif.id, 'new']);

}


// imposto il filtro di ricerca dei fedeli
onSelectionChange(timanif: string)   {
  this.tipoRichiesta = timanif.substring(0,1);
// per impostare il campo corretto di ricerca per i fedele entrati
  this.validSearch = true;
}

ricercaGiornate() {
  if(this.tipoRichiesta == '?') {
     this.validSearch = false;
     alert('effettuare prima la selezione delle giornate ,\n ricerca non possibile');
     return;
  }  else {
      this.loadGiornatefromManif(this.manif.id, this.tipoRichiesta);
   }
}


}


