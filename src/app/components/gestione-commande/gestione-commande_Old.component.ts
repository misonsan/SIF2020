import { Component,  OnInit } from '@angular/core';

import { Giornata } from '../../classes/Giornata';
import { Commanda } from '../../classes/Commanda';
import { Commandariga } from '../../classes/Commandariga';
// provvisoria - va spostato su commandaw2-detail per creazione effettiva


import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';

import { GiornataService }  from './../../services/giornata.service';
import { CommandaService } from './../../services/commanda.service';
import { CommandarigaService } from './../../services/commandariga.service';

import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs/operators';




@Component({
  selector: 'app-gestione-commande',
  templateUrl: './gestione-commande.component.html',
  styleUrls: ['./gestione-commande.component.css']
})
export class GestioneCommandeComponent implements OnInit {

  public title = "Gestione Evasione Commande";
  public titleCucina = "Gestione Cucina";
  public titleBevande = "Gestione Bevande";

  faUndo = faUndo;
  faSave = faSave;
  faHandPointLeft = faHandPointLeft;
  faTrashAlt = faTrashAlt;
  faInfoCircle = faInfoCircle;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faSearch = faSearch;
  faPlusSquare = faPlusSquare;

  public giornata: Giornata;
  public commanda: Commanda;
  public commandaw: Commanda;
  public commande: Commanda[] = [];
  public commandariga: Commandariga;
  public commandarighe: Commandariga[] = [];
  public settore = 0;
  // settori: derivano da valori assegnati a userlevel
  // 2 = cucina
  // 3 = Bevande
  // competenza: valori assegnati in fase di creazione commande
  // 1 = cucina
  // 2 = Bevande
  // quindi quando faccio ricerca per settore devo rimapparlo su competenza per trovare commande con i prodotti corrispondenti
  public competenza = 0;
  public ruolo = 0;

  public idDay = 0;

  public alertSuccess = false;
  public isVisible = false;
  public Message = '';
  public trovatoRecCommande = false;
  public trovatoRecRighe = false;
  public nRecCo = 0;
  public nRecRi = 0;
  public searchText = '';

  public rc = '';

  public  interval = 'minutes';
  public  mm = 0;

  // per paginazione
  p: number = 1;
  p2: number = 1;

  //  tutti       - 0 --> nessun filtro
  //  da Lavorare - 2 --> stato commanda --> 2
  //  parz. Lav.  - 3 --> stato commanda --> 3
  //  evasa         4 --> stato commanda --> 4



  public statoCommanda = 0;





    options = [
      'Tutte',
      'da Evadere',
      'Parzialmente Evase',
      'Evase',
      ];

    optionsLav = [
      'Tutti',
      'da Lavorare',
      'Parz. Lavorate',
      'Consegnati',
      ];

    optionsCon = [
      'Tutti',
      'da Consegnare',
      'Consegnati',
      ];

    optionsProd = [
      'Tutti',
      'da Lavorare',
      'da Consegnare',
      'Consegnati',
      ];

    // ok
    optionsSettore = [
      'Cucina',
      'Bevande'
      ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private giornataService: GiornataService,
              private commandaService: CommandaService,
              private commandarigaService: CommandarigaService) { }


  ngOnInit(): void {

       this.giornata = new Giornata();
       this.route.paramMap.subscribe(p => {
       this.idDay = +p.get('id');
       });
       this.ruolo = parseInt(localStorage.getItem('user_ruolo'));
       alert('OnInit - letto ruolo:' + this.ruolo);
       if(this.ruolo == 1) {
          alert('Operatività non abilitata al Cassiere');
          return;
     }
       if(this.ruolo !== -1) {
          this.settore = this.ruolo;
        } else {
          this.settore = 2;
        }
       if(this.settore === 2) {
        this.title = this.titleCucina;
        this.competenza = 1;
      }
       if(this.settore === 3) {
          this.title = this.titleBevande;
          this.competenza = 2;
        }

     // -------  leggo i dati della giornata
       this.loadGiornata(this.idDay);
       this.statoCommanda = 0;
       this.loadSituazioneClienti(this.statoCommanda);

    }

  async loadSituazioneClienti(stato: number) {

alert('loadSituazioneClienti - stato:' + stato + ' settore: ' + this.settore);

    switch (stato)  {
          case 0:
            this.aggiornaimageDelay(this.idDay, this.settore);
            this.loadCommandefromGiornataeCompetenza(this.idDay, this.settore);
            this.loadCommanderighe(this.settore);
            break;
          case 2:
          case 3:
            this.aggiornaimageDelayFiltro(stato,this.idDay, this.settore);
            this.loadCommandefromGiornataeCompetenzaFiltro(stato,this.idDay, this.settore);
            this.loadCommanderigheFiltro(stato,this.settore);
            break;
          case 4:
            this.loadCommandefromGiornataeCompetenzaFiltro(stato,this.idDay, this.settore);
            this.loadCommanderigheFiltro(stato,this.settore);
            break;
     }

  }




  // gestione per selezione globale

   async  aggiornaimageDelay(idDay: number, settore: number) {

  // la ricerca arrivata da settore devo farla per competenza  come dettagliato su note in definizione campi


    await   this.commandaService.getCommandeforGiornataeCompetenza(idDay, this.competenza).subscribe(
            response => {
                this.commande = response['data'];
                this.nRecCo = response['number'];
                if(response['number'] > 0) {
                  this.aggiornaDelay();
                  alert('aggiornato  --------------------  delay ' );
                }
            },
            error => {
            alert('Gestione.Commande  --AggiornaImageDelay: ' + error.message);
            console.log(error);
            })
     }

   // gestione per selezione globale

   async  loadCommandefromGiornataeCompetenza(idDay: number, settore: number) {

    await   this.commandaService.getCommandeforGiornataeCompetenza(idDay, this.competenza).subscribe(
        response => {
            this.commande = response['data'];
            this.nRecCo = response['number'];
            this.trovatoRecCommande = true;
            this.alertSuccess = true;
            this.Message = 'Situazione Attuale - Nessuna Commanda presente per il tipo di richiesta';
            if(this.nRecCo > 0){
              this.Message = 'Situazione Attuale';
            }
            alert('loadCommandefromGiornataeCompetenza -----  record trovati: ' + this.nRecCo);
        },
        error => {
        alert('Manif-Data  --loadGiornata: ' + error.message);
        console.log(error);
        })
    }


 //   gestione per selezione filtrata in base allo stato della commanda

async  aggiornaimageDelayFiltro(stato: number, idDay: number, settore: number) {

  // la ricerca arrivata da settore devo farla per competenza  come dettagliato su note in definizione campi


    await   this.commandaService.getCommandeforGiornataeCompetenza(idDay, this.competenza).subscribe(
            response => {
                this.commande = response['data'];
                this.nRecCo = response['number'];
                if(response['number'] > 0) {
                  this.aggiornaDelay();
                  alert('aggiornato  --------------------  delay ' );
                }
            },
            error => {
            alert('Gestione.Commande  --AggiornaImageDelay: ' + error.message);
            console.log(error);
            })
     }

   // gestione per selezione filtrata in base allo stato della commanda

   async  loadCommandefromGiornataeCompetenzaFiltro(stato: number, idDay: number, settore: number) {

    await   this.commandaService.getCommandeforGiornataeCompetenzaestato(idDay, this.competenza, stato).subscribe(
        response => {
            this.commande = response['data'];
            this.nRecCo = response['number'];
            this.trovatoRecCommande = true;
            this.alertSuccess = true;
            this.Message = 'Situazione Attuale - Nessuna Commanda presente per il tipo di richiesta';
            if(this.nRecCo > 0){
              this.Message = 'Situazione Attuale';
            }
        },
        error => {
        alert('Manif-Data  --loadGiornata: ' + error.message);
        console.log(error);
        })
    }


    onSelectionChangeProd(select: string) {
      alert('onSelectionChangeProd -  da fare' + select);
    }








    // aggiorno il tempo di attesa delle commande rispetto all'ordinazione
   async aggiornaDelay() {

      alert(' sono appena entrato in ------------- aggiornaDelay');

      for(let comman of this.commande) {

        this.commandaw = comman;
        const date1 = comman.created_at;
        const date2 = new Date();


        this.mm = 60 - this.getDateDiff(date2, date1, this.interval);

        if(this.mm > 999) {
          this.mm = 999;
        }

       // console.log('minutes: -----------------> ' + mm);


        this.commandaw.delay = this.mm;
        if(this.mm <= 10) {
          this.commandaw.semaphore = 'verde.jpg';
        } else if(this.mm > 10 && this.mm <= 15) {
          this.commandaw.semaphore = 'azzurro.jpg';
        } else if(this.mm > 15 && this.mm <= 20) {
          this.commandaw.semaphore = 'giallo.jpg';
        } else if(this.mm > 20 && this.mm <= 25) {
          this.commandaw.semaphore = 'arancio.jpg';
        }else {
          this.commandaw.semaphore = 'viola.jpg';
        }

        await this.commandaService.updateCommanda(this.commandaw).subscribe(
                response => {
                    if(response['success']) {
            //                  alert('----------------------    inserito commandariga' + prg);
                    }
                 },
                error =>
                {
                  console.log(error);
                  this.Message = error.message;
                  this.alertSuccess = false;
                }
            );
        }

        alert('  fine aggiornamento delay per le commande selezionate --------------------   ' );

    }


    getDateDiff(date1, date2, interval) {

      const second = 1000;

      const minute = second * 60;

      const hour = minute * 60;

      const day = hour * 24;

      const week = day * 7;

      date1 = new Date(date1).getTime();
      date2 = new Date(date2).getTime();


     // date2 = (date2 == 'now') ? new Date().getTime() : new Date(date2).getTime();

      var timediff = date2 - date1;

      if (isNaN(timediff)) return NaN;

            switch (interval) {
          //  case "years":
         //   return date2.getFullYear() - date1.getFullYear();
        //    case "months":
         //   return ((date2.getFullYear() * 12 date2.getMonth()) - (date1.getFullYear() * 12 date1.getMonth()));
        //    case "weeks":
       //    return Math.floor(timediff / week);
        //    case "days":

        //    return Math.floor(timediff / day);

        //    case "hours":

        //    return Math.floor(timediff / hour);

            case "minutes":

            return Math.floor(timediff / minute);

        //    case "seconds":

        //    return Math.floor(timediff / second);

        //    default:

        //    return undefined;

            }

      }













  //  da fare
  loadCommanderighe(settore: number) {

  }

  // da fare
  loadCommanderigheFiltro(stato: number, settore: number) {


  }




  async loadGiornata(id: number) {
    //   alert('loadGiornata - id:' + id);
    await this.giornataService.getGiornata(id).subscribe(
    response => {
      this.giornata = response['data'];


// caricare tutte le commande del giono e tutti i prodotti del giorno


    //  this.loadCommandefromGiornata(this.idDay);
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


// imposto il filtro di ricerca delle Commande
onSelectionChangeSettore(settore: string)   {

  switch (settore)  {
    case 'Cucina':
      this.settore = 2;
      this.title = this.titleCucina;
      break;
    case 'Bevande':
      this.settore = 3;
      this.title = this.titleBevande;
      break;
  }
  this.statoCommanda = 0;
  this.loadSituazioneClienti(this.statoCommanda);
}

onSelectionChangeLavorazione(statoProd: string)  {

  switch (statoProd)  {
    case 'Tutti':
      this.statoCommanda = 0;
      break;
    case 'da Lavorare':
      this.statoCommanda = 2;
      break;
    case 'Parz. Lavorate':
      this.statoCommanda = 3;
      break;
    case 'Consegnati':
      this.statoCommanda = 4;
      break;
    }
  alert('scelta filtrata: ' + statoProd + ' -- statoCommanda: ' + this.statoCommanda);
  this.loadSituazioneClienti(this.statoCommanda);
}


onSelectionChangeConsegna(statoProd: string)  {
  alert('da fare');
}

// recupero i dati della commanda selezionata


async loadCommandaSelezionata(id: number) {
  await   this.commandaService.getCommanda(id).subscribe(
    response => {
        this.commanda = response['data'];
        if(response['number'] > 0) {
          this.loadrigheCommandaSelezionata(id);
 
        }
    },
    error => {
    alert('Gestione.Commande  --AggiornaImageDelay: ' + error.message);
    console.log(error);
    })


}

loadrigheCommandaSelezionata(id: number) {
  alert('da fare ')
  // da fare
}


}
