import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Persona } from '../../classes/Persona';
import { Prodotto } from '../../classes/Prodotto';
// service
import { PersonaService }  from '../../services/persona.service'; // ./../../services/fedele.service
import { CommandaService } from './../../services/commanda.service';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { ProdottoService }  from '../../services/prodotto.service'; // ./../../services/fedele.service

import { ActivatedRoute, Router } from '@angular/router';
// icone
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-giornata-data',
  templateUrl: './giornata-data.component.html',
  styleUrls: ['./giornata-data.component.css']
})
export class GiornataDataComponent implements OnInit {

  // istanze
  public giornata: Giornata;


  public visibleCassa = false;
  public visiblePersone = false;
  public visibleProdotti = false;
  public visibleListino = false;
  public titletipo = '';

  // definizione delle icone utilizzate
  faSave = faSave;
  faUndo = faUndo;
  faHandPointLeft = faHandPointLeft;
  faTrashAlt = faTrashAlt;
  faInfoCircle = faInfoCircle;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
// variabili per editazione messaggio
 public alertSuccess = false;
 public savechange = false;
 public isVisible = false;

public title = 'situagione giornaliera -  giornata-data works!';
public manif: Manifestazione;
//public giornata: Giornata;
//  campi calcolati per editazione
// sbilancio
public s100 = 0;
public s050 = 0;
public s020 = 0;
public s010 = 0;
public s005 = 0;
public smoneta = 0;
// valore iniziale
public vi100 = 0;
public vi050 = 0;
public vi020 = 0;
public vi010 = 0;
public vi005 = 0;
public vimoneta = 0;
// valore attuale
public va100 = 0;
public va050 = 0;
public va020 = 0;
public va010 = 0;
public va005 = 0;
public vamoneta = 0;
// valore finale
public vf100 = 0;
public vf050 = 0;
public vf020 = 0;
public vf010 = 0;
public vf005 = 0;
public vfmoneta = 0;
// valore sbilancio
public vs100 = 0;
public vs050 = 0;
public vs020 = 0;
public vs010 = 0;
public vs005 = 0;
public vsmoneta = 0;
// totali
public tinizio = 0;
public tattuale = 0;
public tfinale = 0;
public tsbilancio = 0;
public tutile = 0;

public message = '';
public enabledCassaFinale = false;
public enabledCassaIniziale = false;

public isVisibleActual = false;
public isVisibleFinal = false;

public trovatoRec = false;
public nRec = 0;

// Variabili usate in persone

  public users: Persona[] = [];
  public Message = '';

  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public ruolo = 0;
  public ruoloEnd = 0;

 options = [
    'Tutte',
    'Non Assegnato',
    'Con Ruolo',
    'Non Operativo'
  ];

  // per paginazone
  p: number = 1;


// Variabili usate in Prodotti


public prodotti: Prodotto[] = [];

public tipoRichiestaProd = '?';

public flagMenu = '';

optionsProd = [
  'Tutte',
  'Non a Menù',
  'A Menù'
];


constructor(private router: Router,
           private route: ActivatedRoute,
           private manifService: ManifestazioneService,
           private giornataService: GiornataService,
           private commandaService: CommandaService,
           private personaService: PersonaService,
           private prodottoService: ProdottoService
            ) { }


  ngOnInit(): void {

      // istanzio
       this.giornata = new Giornata();
       // leggo i dati della giornata
       this.route.paramMap.subscribe(p => {
            // -------  leggo i dati della giornata
             this.visualizzaSituazione(+p.get('id'));

       //      alert('loadGiornata - finito OnInit');
         });

        // -------------------------------- carico i dati delle Persone
        this.tipoRichiesta = 'Tutte';
        this.loadPersone();
        // -------------------------------- carico i dati dei Prodotti
        this.tipoRichiestaProd = 'T';
        this.loadProdotti();
     }


    // visualizzazione testata e Cassa
    visualizzaSituazione(id)  {
         // -------  leggo i dati della giornata - Cassa
         this.loadGiornataCassa(id);
    }

    async loadGiornataCassa(id: number) {
      //   alert('loadGiornata - id:' + id);
         await this.giornataService.getGiornata(id).subscribe(
           response => {
            this.giornata = response['data'];
                  // leggo i dati della manifestazione
              this.loadManifestazione(this.giornata.idManifestazione);
                this.controlloCommande();

              //   alert('loadGiornataCassa - effettuato ricalcolo');

         },
         error => {
            alert('Giornata-Data  --loadGiornataCassa: ' + error.message);
            console.log(error);
         }
         )

       }


  async controlloCommande() {
    this.trovatoRec = false;
    this.nRec = 0;

    await  this.commandaService.getCommande().subscribe(
      // sentire hidran per lettura particolare
     // this.fedeleService.getFedeliforMessa(id).subscribe(
        res => {
          //  this.manifestazioni = res['data'];
            this.nRec = res['number'];
            this.trovatoRec = true;

         //  alert('Giornata-Detail   -- loadCommande : ' + this.nRec + ' stato: ' + this.trovatoRec);

               this.conteggiaValori();
         },
        error => {
           alert('Manifestazioni  -- loadManifestazioni - errore: ' + error.message);
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

 conteggiaValori() {

  this.enabledCassaFinale = false;
  this.enabledCassaIniziale = false;

  switch (this.giornata.statoCassa) {
    case 0:
    case 1:
       this.enabledCassaIniziale = true;
       break;
    case 2:
       this.enabledCassaFinale = true;
       break;
     }

     // valori iniziali
  this.vi100 = this.giornata.i100 * 100;
  this.vi050 = this.giornata.i050 * 50;
  this.vi020 = this.giornata.i020 * 20;
  this.vi010 = this.giornata.i010 * 10;
  this.vi005= this.giornata.i005 * 5;
  this.vimoneta = this.giornata.icontante;
  // valori attuali
  this.va100 = this.giornata.a100 * 100;
  this.va050 = this.giornata.a050 * 50;
  this.va020 = this.giornata.a020 * 20;
  this.va010 = this.giornata.a010 * 10;
  this.va005= this.giornata.a005 * 5;
  this.vamoneta = this.giornata.acontante;

 // valori finali
  this.vf100 = this.giornata.f100 * 100;
  this.vf050 = this.giornata.f050 * 50;
  this.vf020 = this.giornata.f020 * 20;
  this.vf010 = this.giornata.f010 * 10;
  this.vf005= this.giornata.f005 * 5;
  this.vfmoneta = this.giornata.fcontante;

 // sbilancio
  this.s100 = this.giornata.f100 - this.giornata.i100;
  this.s050 = this.giornata.f050 - this.giornata.i050;
  this.s020 = this.giornata.f020 - this.giornata.i020;
  this.s010 = this.giornata.f010 - this.giornata.i010;
  this.s005 = this.giornata.f005 - this.giornata.i005;
  this.smoneta = this.giornata.fcontante - this.giornata.icontante;

  this.vs100 = this.s100 * 100;
  this.vs050 = this.s050 * 50;
  this.vs020 = this.s020 * 20;
  this.vs010 = this.s010 * 10;
  this.vs005= this.s005 * 5;
  this.vsmoneta = this.smoneta;
  //  totali
  this.tinizio = this.vi100 + this.vi050 + this.vi020 +
                 this.vi010 + this.vi005 + (this.giornata.icontante * 1);

  this.tattuale = this.va100 + this.va050 + this.va020 +
                 this.va010 + this.va005 + (this.vamoneta * 1);
  this.tfinale = this.vf100 + this.vf050 + this.vf020 +
                 this.vf010 + this.vf005 + (this.vfmoneta * 1);
  this.tsbilancio = this.s100 + this.s050 + this.s020 +
                 this.s010 + this.s005 + (this.smoneta * 1);
/*
   if(this.nRec == 0) {
    this.s100 = this.giornata.a100 - this.giornata.i100;
    this.s050 = this.giornata.a050 - this.giornata.i050;
    this.s020 = this.giornata.a020 - this.giornata.i020;
    this.s010 = this.giornata.a010 - this.giornata.i010;
    this.s005 = this.giornata.a005 - this.giornata.i005;
    this.smoneta = this.giornata.acontante - this.giornata.icontante;

     }  else {
      this.s100 = this.giornata.f100 - this.giornata.a100;
      this.s050 = this.giornata.f050 - this.giornata.a050;
      this.s020 = this.giornata.f020 - this.giornata.a020;
      this.s010 = this.giornata.f010 - this.giornata.a010;
      this.s005 = this.giornata.f005 - this.giornata.a005;
      this.smoneta = this.giornata.fcontante - this.giornata.acontante;

     }  */

     this.s100 = this.giornata.a100 - this.giornata.i100;
     this.s050 = this.giornata.a050 - this.giornata.i050;
     this.s020 = this.giornata.a020 - this.giornata.i020;
     this.s010 = this.giornata.a010 - this.giornata.i010;
     this.s005 = this.giornata.a005 - this.giornata.i005;
     this.smoneta = this.giornata.acontante - this.giornata.icontante;

if(this.giornata.statoCassa == 2) {
  this.s100 = this.giornata.f100 - this.giornata.i100;
  this.s050 = this.giornata.f050 - this.giornata.i050;
  this.s020 = this.giornata.f020 - this.giornata.i020;
  this.s010 = this.giornata.f010 - this.giornata.i010;
  this.s005 = this.giornata.f005 - this.giornata.i005;
  this.smoneta = this.giornata.fcontante - this.giornata.icontante;

}
     this.vs100 = this.s100 * 100;
     this.vs050 = this.s050 * 50;
     this.vs020 = this.s020 * 20;
     this.vs010 = this.s010 * 10;
     this.vs005= this.s005 * 5;
     this.vsmoneta = this.smoneta;

     this.tsbilancio = this.vs100 + this.vs050 + this.vs020 +
                       this.vs010 + this.vs005 + (this.vsmoneta * 1);


}

// ritorno a altra atb
backToGiornata(){
  // this.router.navigate(['users']); // rimandavo a elenco utenti
   this.router.navigate(['manif/' + this.giornata.idManifestazione]);

}

//  ------------------------------     visualizzazione persone

async loadPersone() {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.personaService.getPersone().subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
          this.users = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Persone  -- loadPersone - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}


onSelectionChange(tiruolo: string)   {


  this.tipoRichiesta = tiruolo;  //tifedel.substring(0,1);
  this.validSearch = true;

  if(this.tipoRichiesta == '?') {
    this.validSearch = false;
    alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
    return;
    }  else {

          switch (this.tipoRichiesta) {
              case 'Tutte':
              this.loadPersone();
           //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
              break;
              case 'Non Assegnato':
                this.ruolo = 0;
                this.loadPersoneconRuolo1(this.ruolo);
                break;
              case 'Con Ruolo':
            //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.ruolo = 90;
                this.loadPersoneconRuolo2(this.ruolo);
                 break;
              case 'Non Operativo':
                this.ruolo = 99;
                this.loadPersoneconRuolo1(this.ruolo);
                break;
              default:
              alert('Scelta errata \n ricerca non possibile');
              break;
        }
      }

  }

  /*
  ricercaPersone() {

    //alert(' Funzione da attivare dopo spiegazione di Hidran');
    //return;

  // il campo messa.id è  del record presente this.messa.id


        if(this.tipoRichiesta == '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
        return;
        }  else {

              switch (this.tipoRichiesta) {
                  case 'Tutte':
                  this.loadPersone();
               //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                  break;
                  case 'Non Assegnato':
                    this.ruolo = 0;
                    this.loadPersoneconRuolo1(this.ruolo);
                    break;
                  case 'Con Ruolo':
                //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                    this.ruolo = 90;
                    this.loadPersoneconRuolo2(this.ruolo);
                     break;
                  case 'Non Operativo':
                    this.ruolo = 99;
                    this.loadPersoneconRuolo1(this.ruolo);
                    break;
                  default:
                  alert('Scelta errata \n ricerca non possibile');
                  break;
            }
          }
      }
*/

  async   loadPersoneconRuolo2(ruolo1: number) {
       // alert('funzione da attivare dopo spiegazione di Hidran');

       this.trovatoRec = false;
       this.nRec = 0;
       this.isVisible = true;
       await  this.personaService.getPersoneforRuoloFiltrato(ruolo1).subscribe(
         // sentire hidran per lettura particolare
        // this.fedeleService.getFedeliforMessa(id).subscribe(
           res => {
               this.users = res['data'];
               this.nRec = res['number'];
               this.trovatoRec = true;
               this.Message = 'Situazione Attuale';
               this.alertSuccess = true;
          //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
            },
           error => {
              alert('Persone  -- loadPersoneconRuolo2 - errore: ' + error.message);
              console.log(error);
              this.Message = error.message;
              this.alertSuccess = false;
           }
         )
      }

      async   loadPersoneconRuolo1(ruolo: number) {
     //   alert('funzione da attivare dopo spiegazione di Hidran');
        this.trovatoRec = false;
        this.nRec = 0;
        this.isVisible = true;
        await  this.personaService.getPersoneforRuolo1(ruolo).subscribe(
          // sentire hidran per lettura particolare
         // this.fedeleService.getFedeliforMessa(id).subscribe(
            res => {
                this.users = res['data'];
                this.nRec = res['number'];
                this.trovatoRec = true;
                this.Message = 'Situazione Attuale';
                this.alertSuccess = true;
           //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
             },
            error => {
               alert('Persone  -- loadPersoneconRuolo1 - errore: ' + error.message);
               console.log(error);
               this.Message = error.message;
               this.alertSuccess = false;
            }
          )
      }

//  ------------------------------     visualizzazione Prodotti




async loadProdotti() {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.prodottoService.getProdotti().subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
          this.prodotti = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Prodotti  -- loadPersone - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}


async loadProdottibyMenu(menu: string) {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.prodottoService.getProdottiforMenu(menu).subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
          this.prodotti = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Prodotti  -- loadPersonebyMenu - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}

// imposto il filtro di ricerca dei fedeli
onSelectionChangeProd(menu: string)   {

menu.substring(0,1);
this.tipoRichiestaProd = menu;
this.validSearch = true;

//alert('ho selezionato:' + tifedel + ' valore: ' + this.tipoRichiesta);

}




ricercaProdotto() {

  if(this.tipoRichiestaProd == '?') {
      this.validSearch = false;
      alert('effettuare prima la selezione del prodotto per Menuù ,\n ricerca non possibile');
      return;
      }  else {

            switch (this.tipoRichiestaProd) {
                case 'T':
                this.loadProdotti();
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                break;
                case 'N':
                case 'A':
                  this.flagMenu = this.tipoRichiestaProd;
                  this.loadPersonebyMenu(this.tipoRichiestaProd);
                  break;
                default:
                alert('Scelta errata \n ricerca non possibile');
                break;
          }
        }
    }

    async loadPersonebyMenu(amenu: string) {

      //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
      this.trovatoRec = false;
      this.nRec = 0;
      this.isVisible = true;
      await  this.prodottoService.getProdottiforMenu(amenu).subscribe(
        // sentire hidran per lettura particolare
       // this.fedeleService.getFedeliforMessa(id).subscribe(
          res => {
              this.prodotti = res['data'];
              this.nRec = res['number'];
              this.trovatoRec = true;
              this.Message = 'Situazione Attuale';
              this.alertSuccess = true;
         //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
           },
          error => {
             alert('Persone  -- loadPersone - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
          }
        )
    }




  }


