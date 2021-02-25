import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Commanda } from '../../classes/Commanda';

import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { CommandaService }  from './../../services/commanda.service';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-commanda-detail',
  templateUrl: './commanda-detail.component.html',
  styleUrls: ['./commanda-detail.component.css']
})
export class CommandaDetailComponent implements OnInit {

   // definizione delle icone utilizzate
   faSave = faSave;
   faUndo = faUndo;
   faHandPointLeft = faHandPointLeft;
   faTrashAlt = faTrashAlt;
   faInfoCircle = faInfoCircle;
   faThumbsUp = faThumbsUp;
   faThumbsDown = faThumbsDown;
   faSearch = faSearch;
   faPlusSquare = faPlusSquare;

// variabili per editazione messaggio
  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public textMessage1 = '';
  public textMessage2 = '';
  public textUser = '';
  public headerPopup = '';
  public Message = '';

public title = 'situagione giornaliera Commande  -  Commanda-detail';
public manif: Manifestazione;
public giornata: Giornata;


  public commande: Commanda[] = [];

  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;
  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';
  public nDay = 0;
  public statoRic = 0;

  public searchText = '';


  options = [
    'Tutte',
    'Creata Provvisoria',
    'Creata Definitiva',
    'Evasa',
    ];

// per paginazone
p: number = 1;

constructor(private router: Router,
             private route: ActivatedRoute,
             private manifService: ManifestazioneService,
             private giornataService: GiornataService,
             private commandaService: CommandaService,
              ) { }

ngOnInit(): void {
     this.isVisible  = true;
     this.tipoRichiesta = "T";
     this.giornata = new Giornata();

     this.route.paramMap.subscribe(p => {
     this.nDay = +p.get('id');
     // -------  leggo i dati della giornata
     this.loadGiornata(+p.get('id'));
     });
}

async loadGiornata(id: number) {
     //   alert('loadGiornata - id:' + id);
     await this.giornataService.getGiornata(id).subscribe(
     response => {
       this.giornata = response['data'];
       this.loadManifestazione(this.giornata.idManifestazione);
       this.loadCommandefromGiornata(this.nDay);
       this.alertSuccess = true;
       this.Message = "Situazione Attuale";
     },
     error => {
       this.Message = error.message;
       this.alertSuccess = false;
     alert('Manif-Data  --loadGiornata: ' + error.message);
     console.log(error);
     }
   )
}


// recupero i dati della messa
async loadManifestazione(id: number) {
     // alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
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

backToGiornata(){
// this.router.navigate(['users']); // rimandavo a elenco utenti
this.router.navigate(['manif/' + this.giornata.idManifestazione]);

}



registra()  {
  // salvo il numero della giornata su localStorage
  localStorage.setItem('idGiornata',  String(this.giornata.id))                        ;
  this.router.navigate(['commandaw/' +  this.giornata.idManifestazione + '/new']);
}

ricercaCommande(){
  alert(' da fare');
}

// imposto il filtro di ricerca delle Commande
onSelectionChange(ticomma: string)   {
      switch (ticomma)  {
        case 'Tutte':
          this.statoRic = 0;
          break;
        case 'Creata Provvisoria':
           this.statoRic = 1;
           break;
        case 'Creata Definitiva':
          this.statoRic = 2;
          break;
        case 'Evasa':
            this.statoRic = 3;
            break;
        case 'Annullata':
            this.statoRic = 4;
            break;
        case 'Chiusa e Stampata':
              this.statoRic = 5;
              break;
        default:
            this.statoRic = 0;;
            break;
    }
    if(this.statoRic  == 0) {
       this.loadCommandefromGiornata(this.giornata.id);
    }  else {
       this.loadCommandebyGiornataFiltro(this.giornata.id, this.statoRic);
    }

}

async loadCommandebyGiornataFiltro(id: number, tipoRic: number)  {
  await this.commandaService.getCommandeforGiornataFiltro(id, tipoRic).subscribe(
    response => {
        this.commande = response['data'];
        this.nRec = response['number'];
        this.trovatoRec = true;
        this.alertSuccess = true;
        this.Message = 'Situazione Attuale - Nessuna Commanda presente per il tipo di richiesta';
        if(this.nRec > 0){
          this.Message = 'Situazione Attuale';
        }
    },
    error => {
    alert('Manif-Data  --loadGiornata: ' + error.message);
    console.log(error);
    }
  )
}

async loadCommandefromGiornata(id: number)  {
  await this.commandaService.getCommandeforGiornata(id).subscribe(
      response => {
          this.commande = response['data'];
          this.nRec = response['number'];
          this.trovatoRec = true;
          this.alertSuccess = true;
          this.Message = 'Situazione Attuale - Nessuna Commanda presente per il tipo di richiesta';
          if(this.nRec > 0){
            this.Message = 'Situazione Attuale';
          }
      },
      error => {
      alert('Manif-Data  --loadGiornata: ' + error.message);
      console.log(error);
      }
    )
  }

}


