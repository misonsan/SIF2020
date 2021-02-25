import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Commandaw } from '../../classes/Commandaw';
import { Commandawriga } from '../../classes/Commandawriga';
// provvisoria - va spostato su commandaw2-detail per creazione effettiva
import { Commanda } from '../../classes/Commanda';
import { Commandariga } from '../../classes/Commandariga';
import { Moneyw } from '../../classes/Moneyw';
import { Moneypayment } from '../../classes/Moneypayment';
import { Moneypay } from '../../classes/Moneypay';
import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { CommandawService }  from './../../services/commandaw.service';
// provvisoria - VA SPOSTATA SU COMMANDAW2-DETAIL PER CREAZIONE effettiva
import { CommandaService } from './../../services/commanda.service';
import { CommandawrigaService } from './../../services/commandawriga.service';
import { CommandarigaService } from './../../services/commandariga.service';
import { MoneywService } from './../../services/moneyw.service';
import { MoneypaymentService } from './../../services/moneypayment.service';
import { MoneypayService } from './../../services/moneypay.service';

import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faPlusSquare, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-commandaw2-detail',
  templateUrl: './commandaw2-detail.component.html',
  styleUrls: ['./commandaw2-detail.component.css']
})
export class Commandaw2DetailComponent implements OnInit {

  public title = 'Registrazione Incasso Commanda  -  Commandaw2-detail';

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
 faPlus = faPlus;
 faMinus = faMinus;


// variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;

public textMessage1 = '';
public textMessage2 = '';
public textUser = '';
public headerPopup = '';
public Message = '';


public manif: Manifestazione;
public giornata: Giornata;
public commandaw: Commandaw;
public commandawriga: Commandawriga;
public moneyw: Moneyw;
public moneypayment: Moneypayment;     // da eliminare - problema al controller

public moneypay: Moneypay;
public commandawrighe: Commandawriga[] = [];
public commandariga: Commandariga;
public commandarigaw: Commandariga;
// temporanea
public commanda: Commanda;
public commandanew: Commanda;

public nRec = 0;
public trovatoRec = false;
public tipoRichiesta = '?';
public ricManif = 0;
public validSearch = false;
private textMessage = '';
public nDay = 0;
public statoRic = 0;
public registrata = false;
public statotip = 0;
public keyidriga = 0;

// per passare dati da figlio a padre
public qtaPassato = '';

// abilto e/o disabilito pusanti resto

public darendere = 0;

// provvisori  - da spostare in commandaw2-detail per pagamento e creazione commanda definitiva

public newCommandaid = 0;
public newCommandanProdotti = 0;
public newCommandaiProdotti = 0;
public newCommandaCoperto = 0;
public idDay = 0;
public impCassa  = 0;
public taglia = 0;
public pezzi_i = 0;
public pezzi_r = 0;
public valore_i = 0;
public valore_r = 0;


constructor(private router: Router,
            private route: ActivatedRoute,
            private manifService: ManifestazioneService,
            private giornataService: GiornataService,
            private commandawService: CommandawService,
            private commandaService: CommandaService,
            private moneywService: MoneywService,
            private moneypaymentService: MoneypaymentService,
            private commandawrigaService: CommandawrigaService,
            private commandarigaService: CommandarigaService,
            private moneypayService: MoneypayService
          ) { }


  ngOnInit(): void {
    // nella url passo il codice della giornata
     this.isVisible  = true;
     this.registrata = false;
     this.commandaw = new Commandaw();
     this.route.paramMap.subscribe(p => {
     this.commandaw.id = +p.get('id');
     // -------  leggo i dati della commanda di lavoro
    // alert('cammandaw1 - OnInit: ' + this.commandaw.id);
     this.loadCommandaW(this.commandaw.id);
     this.moneyw = new Moneyw();
     this.moneyw.id = this.commandaw.id;
     this.caricaMoneyw(this.moneyw);
     });
  }


  async caricaMoneyw(moneyw: Moneyw)  {
    // cancello la vecchia cassa
    await this.moneywService.deleteMoneyw(moneyw).subscribe(
      response => {
        if(response['success']) {
    //        alert('caricaMoneyW - effettuata cancellazione cassa precedente ');
        } else {
          alert('caricaMoneyW - Cassa Assente NON effettuata cancellazione cassa precedente ----> ' + moneyw.id);
        }

        this.CreaMoneyw(moneyw)

      },
      error => {
        this.isVisible  = true;
        this.Message = error.message;
        this.alertSuccess = false;
        alert('Commandaw2-Detail  --caricaMoneyw' +  error.message);
      console.log(error);
      }
    )
  }


 async  CreaMoneyw(moneyw: Moneyw) {
  await this.moneywService.createMoneyw(moneyw).subscribe(
        response => {
          if(response['rc'] == 'ok') {
     //         alert('CreaMoneyw - ricreata Cassa ');
          } else {
            alert('CreateMoneyw - boooooh    !!!! RC: -----> '   +  response['rc']);
          }
         },
        error => {
          this.isVisible  = true;
          this.Message = error.message;
          this.alertSuccess = false;
        alert('Commandaw2-Detail  --CreaMoneyw: ' + error.message);
        console.log(error);
        }
      )
  }

  async loadCommandaW(id: number) {

   // alert('loadCommandaW : ' + id);

    await this.commandawService.getCommandaw(id).subscribe(
      response => {
        this.commandaw = response['data'];
    //    alert('loadCommandaW : step1 ');
        this.loadGiornata(this.commandaw.idGiornata)
    //    alert('loadCommandaW : ------- step2 ');
        this.alertSuccess = true;
        this.Message = "Situazione Attuale";
      },
      error => {
        this.isVisible  = true;
        this.Message = error.message;
        this.alertSuccess = false;
      alert('Manif-Data  --loadCommandaw: ' + error.message);
      console.log(error);
      }
    )
  }


  async loadGiornata(id: number) {
    //    alert('loadGiornata - id:' + id);
     await this.giornataService.getGiornata(id).subscribe(
     response => {
       this.giornata = response['data'];
       this.loadManifestazione(this.giornata.idManifestazione);
       },
     error => {
       this.isVisible  = true;
       this.Message = error.message;
       this.alertSuccess = false;
     alert('Manif-Data  --loadGiornata: ' + error.message);
     console.log(error);
     }
   )
  }

  // recupero i dati della messa
  async loadManifestazione(id: number) {
   //   alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
     await  this.manifService.getManifestazione(id).subscribe(
     response => {
     this.manif = response['data'];
     },
     error => {
       this.isVisible  = true;
       this.Message = error.message;
       this.alertSuccess = false;
     alert('Manif-Data  --loadManifestazione: ' + error.message);
     console.log(error);
     }
   )
  }



  RegistraeStampaCommanda() {
   // alert('sto aggiornano il metodo ');
    // recupero il numero della prossima Commanda


    this.loadCassaActual();
    this.loadLastCommanda();


  }


  async loadLastCommanda()  {
    await this.commandaService.getLastCommandaid().subscribe(
          response => {
        if(response['Rc'] == 'Ok')  {
             this.commanda =   response['data'];
       //   alert('letto ultimo numero commanda' + this.commanda.id);
        }  else {
          alert('NON ho letto ultimo numero commanda');
          this.commanda = new Commanda();
        }
        this.CreaNewCommanda();
        this.AggiornaCassa();
        this.creacommandarighe();
       // this.CreaAllMoneyPaymant();    // vecchia versione   sostituita da Moneypay
        this.CreaAllMoneyPay();
      },
      error => {
      alert('Commandaw1-Detail  --loadlastCommanda: ' + error.message);
      console.log(error);
      }
    )

    }

    loadCassaActual() {
      // da Giornata prendo i dati della cassa attuale

      this.impCassa = (this.giornata.a100 * 100 ) +
                      (this.giornata.a050 * 50)  +
                      (this.giornata.a020 * 20)  +
                      (this.giornata.a010 * 10)  +
                      (this.giornata.a005 * 5)  +
                      (this.giornata.acontante * 1) ;
    }


    async AggiornaCassa() {
      //  aggiornare la cassa e create i movimenti su moneypayment

      this.giornata.a100  = this.giornata.a100 + this.moneyw.i100 - this.moneyw.r100;
      this.giornata.a050  = this.giornata.a050 + this.moneyw.i050 - this.moneyw.r050;
      this.giornata.a020  = this.giornata.a020 + this.moneyw.i020 - this.moneyw.r020;
      this.giornata.a010  = this.giornata.a010 + this.moneyw.i010 - this.moneyw.r010;
      this.giornata.a005  = this.giornata.a005 + this.moneyw.i005 - this.moneyw.r005;
      this.giornata.acontante = this.giornata.acontante + this.moneyw.icontante - this.moneyw.rcontante;

      this.giornata.a100Valore = (this.giornata.a100 * 100);
      this.giornata.a050Valore = (this.giornata.a050 * 50);
      this.giornata.a020Valore = (this.giornata.a020 * 20);
      this.giornata.a010Valore = (this.giornata.a010 * 10);
      this.giornata.a005Valore = (this.giornata.a005 * 5);
      this.giornata.acontante =  (this.giornata.acontante * 1);

       await this.giornataService.updateGiornata(this.giornata).subscribe(
        response =>  {
              if(response['success']) {

         //       alert('Giornata ' + this.giornata.id + ' Aggiornato Cassa con successo - togliere Alert');
             } else {
               alert(response['message']);
             }
        },
        error => {
        alert('Commandaw2-detail  --Aggiorna Cassa: ' + error.message);
        console.log(error);
        }
      )

    }



   CreaAllMoneyPay() {

   // alert(' ------------------------   creaAllMoneyPay - inizio');
    // salvo la situazione incassi e resti effettuati
    // -----------------------   Incassi e resto € 100
       if(this.moneyw.i100 > 0  || this.moneyw.r100 > 0) {
              this.taglia = 5;
              this.pezzi_i = this.moneyw.i100;
              this.pezzi_r = this.moneyw.r100;
              this.valore_i = this.moneyw.i100 * 100;
              this.valore_r = this.moneyw.r100 * 100;
             this.CreaMoneyPay(this.taglia, this.moneyw.i100, this.moneyw.r100, this.valore_i, this.valore_r);
       }



    // -----------------------   Incassi e resto € 50
        if(this.moneyw.i050 > 0  || this.moneyw.r050 > 0) {
              this.taglia = 4;
              this.pezzi_i = this.moneyw.i050;
              this.pezzi_r = this.moneyw.r050;
              this.valore_i = this.moneyw.i050 * 50;
              this.valore_r = this.moneyw.r050 * 50;
              this.CreaMoneyPay(this.taglia, this.moneyw.i050, this.moneyw.r050, this.valore_i, this.valore_r);
        }



    // -----------------------   Incassi e resto € 20

      if(this.moneyw.i020 > 0  || this.moneyw.r020 > 0)   {
          this.taglia = 3;
          this.pezzi_i = this.moneyw.i020;
          this.pezzi_r = this.moneyw.r020;
          this.valore_i = this.moneyw.i020 * 20;
          this.valore_r = this.moneyw.r020 * 20;
          this.CreaMoneyPay(this.taglia, this.moneyw.i020, this.moneyw.r020, this.valore_i, this.valore_r);
        }

    // -----------------------   Incassi e resto € 10
        if(this.moneyw.i010 > 0  || this.moneyw.r010 > 0)  {
          this.taglia = 2;
          this.pezzi_i = this.moneyw.i010;
          this.pezzi_r = this.moneyw.r010;
          this.valore_i = this.moneyw.i010 * 10;
          this.valore_r = this.moneyw.r010 * 10;
          this.CreaMoneyPay(this.taglia, this.moneyw.i010, this.moneyw.r010, this.valore_i, this.valore_r);
        }

    // -----------------------   Incassi e resto € 5
        if(this.moneyw.i005 > 0  || this.moneyw.r005 > 0)  {
          this.taglia = 1;
          this.pezzi_i = this.moneyw.i005;
          this.pezzi_r = this.moneyw.r005;
          this.valore_i = this.moneyw.i005 * 5;
          this.valore_r = this.moneyw.r005 * 5;
         this.CreaMoneyPay(this.taglia, this.moneyw.i005, this.moneyw.r005, this.valore_i, this.valore_r);
        }

     // -----------------------   Incassi e resto Moneta
       if(this.moneyw.icontante > 0  || this.moneyw.rcontante > 0)  {
        this.taglia = 6;
        this.pezzi_i = 0;
        this.pezzi_r = 0;
        this.valore_i = this.moneyw.icontante * 1;
        this.valore_r = this.moneyw.rcontante * 1;
        this.CreaMoneyPay(this.taglia, this.moneyw.icontante, this.moneyw.rcontante, this.valore_i, this.valore_r);
       }
   //    alert('creaAllMoneyPay - --------  fine');
        this.router.navigate(['prewcommanda/' +  this.commanda.id]);

   }

   async CreaMoneyPay(taglia, pezzi_i, pezzi_r, importo_i, importo_r)  {

    //alert('--------------------------------- creaMoneyPay - taglia: ' + taglia);
   // alert('-----------  Pezzi_i  ------------------- creaMoneyPay  ' + pezzi_i);
    //alert('-----------  Pezzi_r  ------------------- creaMoneyPay ' + pezzi_r);

    this.moneypay = new Moneypay();

    this.moneypay.idTaglia = taglia;
    this.moneypay.nro_pezzi_entrata = pezzi_i;
    this.moneypay.nro_pezzi_uscita = pezzi_r;

    this.moneypay.imp_entrata = importo_i;
    this.moneypay.imp_uscita = importo_r;
    this.moneypay.idGiornata = this.giornata.id;
    this.moneypay.idCommanda = this.newCommandaid;
    this.moneypay.key_utenti_operation = parseInt(localStorage.getItem('id'));

    if(importo_i > 0) {
      this.moneypay.movimento = "E";
    }
    if(importo_r > 0) {
      this.moneypay.movimento = "U";
    }
    if(importo_i > 0 && importo_r > 0) {
      this.moneypay.movimento = "EU";
    }
    // alert('------------------------ preparato moneypayment per inserimento  - taglia: ' + taglia);

     await  this.moneypayService.createMoneypay(this.moneypay).subscribe(
        response =>  {
                  if(response['Ok']) {
       //                     alert('moneypay per la commanda ' + this.newCommandaid + ' Creata con successo -----  da eliminare alert');
                 }
        },
        error => {
              alert('Commandaw2-detail  --CreaMoneyPay: ' + error.message);
              console.log(error);
        }
      );

     }







    async creacommandarighe() {
      // crea le righe commanda da commandawrighe   con qta > 0

      // alla fine mettere messaggio di regolare creazione commanda
      // togliere pulsante sotto di salva

      await this.commandawrigaService.getProdottiOrdinati(this.commandaw.id).subscribe(
        response => {
            if(response['number'] > 0) {            //  response['success']
              this.commandawrighe =   response['data'];
           alert('----------   registraCommandaRighe  - trovate ' + response['number'] + ' prodotti da clonare');
              this.loadLastriga();
              this.crearigheCommanda();
            }
        },
        error =>
        {
         this.Message = error.message;
         this.alertSuccess = false;
          console.log(error);
        }
      );
    }

   async loadLastriga() {
    await this.commandarigaService.getLastCommandarigaid().subscribe(
        response => {

        //  alert('letto ultimo numero commanda');
          this.commandarigaw =    response['data'];
          this.keyidriga = this.commandarigaw.id;
       //   alert('ultimariga du commandariga: -----------> ' + this.commandarigaw.id);
          },
        error => {
        alert('Commandaw2-Detail  --loadlastriga: ' + error.message);
        console.log(error);
        }
      )
    }

    async crearigheCommanda() {

       alert('commandaW - creaarigheCommanda');

        for(let wriga of this.commandawrighe) {
          this.commandariga = new Commandariga();

          this.keyidriga = this.keyidriga  + 1;
          this.commandariga.id = this.keyidriga;
          this.commandariga.idCommanda = this.newCommandaid;
          this.commandariga.idProdotto = wriga.idProdotto;
          this.commandariga.prezzo = wriga.prezzo_day;
          this.commandariga.categoria = wriga.categoria;
          this.commandariga.competenza = wriga.competenza;
          this.commandariga.qta_ord = wriga.qta;
          this.commandariga.descrizione_prodotto = wriga.descrizione_prodotto;
          this.commandariga.key_utenti_operation = parseInt(localStorage.getItem('id'));
          this.commandariga.ora_inizio = new Date();
      //               alert('pronto per registrare riga -------------  ' + this.keyidriga);
          await this.commandarigaService.createCommandariga(this.commandariga).subscribe(
                  response => {
                      if(response['success']) {
              //                  alert('----------------------    inserito commandariga' + prg);
                      }
                      /*
                      else {
                        alert(response['message']);
                        this.Message = response['message'];
                        this.alertSuccess = false;
                      }  */
                  },
                  error =>
                  {
                    console.log(error);
                    this.Message = error.message;
                    this.alertSuccess = false;
                  }
              );
        }

        this.Message = "Commanda creata Regolarmente";
        this.registrata = true;
        this.alertSuccess = true;
      }



    async  CreaNewCommanda() {
/*
  noteCommanda: string;    da gestire quando salvo le note in fase di registrazione

*/

      this.commandanew = new Commanda();
      this.newCommandaid = this.commanda.id + 1;
      this.commandanew.id = this.newCommandaid;
      this.commandanew.anagrafica_cliente = this.commandaw.anagrafica_cliente;
      this.commandanew.idSanfra = this.commandaw.idSanfra;
      this.commandanew.idGiornata = this.giornata.id;
      this.commandanew.buonoPasto = this.commandaw.buonoPasto;
      this.commandanew.numTavolo = this.commandaw.numTavolo;
      this.commandanew.numPersone = this.commandaw.numPersone;
      this.commandanew.numProdotti =  this.commandaw.numProdotti;
      this.commandanew.importoProdotti = this.commandaw.importoProdotti;
      this.commandanew.importoCoperto = this.commandaw.importoCoperto;
      this.commandanew.importodaPagare = this.commandaw.importodaPagare;
      this.commandanew.importoPagato = this.commandaw.importoPagato;
      this.commandanew.cassaAttuale = this.impCassa;
      this.commandanew.resto = this.commandaw.resto;
      this.commandanew.key_utenti_operation = parseInt(localStorage.getItem('id'));
   //   this.commandanew.dtCommanda = new Date();   lo aggiunge lui in automatico
      this.commandanew.stato = this.commandaw.stato;



    //  alert('--------------------------------------   pronto per scrivere nuova Commanda');




      await  this.commandaService.createCommanda(this.commandanew).subscribe(
        response =>  {
              if(response['success']) {
                this.commandanew = response['data'];
        //        alert('commanda ' + this.commanda.id + ' Creata con successo');
             } else {
               alert(response['message']);
             }
        },
        error => {
        alert('Commandawl-detail  --CreaNewCommanda: ' + error.message);
        console.log(error);
        }
      )
    }





  tolgoDenaro(taglia: string) {

    switch (taglia)  {
      case 'i100':
        this.moneyw.i100 = this.moneyw.i100 - 1;
        break;
      case 'i050':
          this.moneyw.i050 = this.moneyw.i050 - 1;
          break;
      case 'i020':
          this.moneyw.i020 = this.moneyw.i020 - 1;
          break;
      case 'i010':
            this.moneyw.i010 = this.moneyw.i010 - 1;
           break;
      case 'i005':
            this.moneyw.i005 = this.moneyw.i005 - 1;
           break;
    }
    this.aggiornaIncasso();
  }


  aggiornaIncasso() {

    if (isNaN(this.moneyw.icontante)) {
      alert('il valore della moneta non è corretto');
      return;
    } else {
      this.moneyw.i100Valore = this.moneyw.i100 * 100;
      this.moneyw.i050Valore = this.moneyw.i050 * 50;
      this.moneyw.i020Valore = this.moneyw.i020 * 20;
      this.moneyw.i010Valore = this.moneyw.i010 * 10;
      this.moneyw.i005Valore = this.moneyw.i005 * 5;


      this.moneyw.incasso = (this.moneyw.i100 * 100 ) +
                            (this.moneyw.i050 * 50)  +
                            (this.moneyw.i020 * 20)  +
                            (this.moneyw.i010 * 10)  +
                            (this.moneyw.i005 * 5)  +
                            (this.moneyw.icontante * 1) ;
      this.commandaw.importoPagato = this.moneyw.incasso;
      // abilito e/o disabilito pulsanti resto in funzione di quanto pagato

       this.darendere =  this.commandaw.importoPagato - this.commandaw.importodaPagare ;

    //  alert('----------------------  aggiornaIncasso: ----->' + this.moneyw.incasso);
    }


  }


  aggiornaResto() {

    if (isNaN(this.moneyw.rcontante)) {
      alert('il valore della moneta non è corretto');
      return;
    } else {
      this.moneyw.r100Valore = this.moneyw.r100 * 100;
      this.moneyw.r050Valore = this.moneyw.r050 * 50;
      this.moneyw.r020Valore = this.moneyw.r020 * 20;
      this.moneyw.r010Valore = this.moneyw.r010 * 10;
      this.moneyw.r005Valore = this.moneyw.r005 * 5;
      this.moneyw.rcontante = this.moneyw.rcontante * 1;

      this.moneyw.resto = (this.moneyw.r100 * 100 ) +
                            (this.moneyw.r050 * 50)  +
                            (this.moneyw.r020 * 20)  +
                            (this.moneyw.r010 * 10)  +
                            (this.moneyw.r005 * 5)  +
                            (this.moneyw.rcontante);
     // this.commandaw.resto = this.commandaw.importoPagato -  this.commandaw.importodaPagare -  this.moneyw.resto;
         this.commandaw.resto = this.moneyw.resto;
         this.darendere =  this.commandaw.importoPagato - this.commandaw.importodaPagare - this.commandaw.resto;  // this.commandaw.resto;
        if(this.darendere < 0) {
          alert('errato importo reso');
        }

         //   alert('----------------------  aggiornaResto: ----->' + this.moneyw.resto);
    }


  }



  aggiungoDenaro(taglia: string) {

    switch (taglia)  {
      case 'i100':
        this.moneyw.i100 = this.moneyw.i100 + 1;
        break;
      case 'i050':
          this.moneyw.i050 = this.moneyw.i050 + 1;
          break;
      case 'i020':
          this.moneyw.i020 = this.moneyw.i020 + 1;
          break;
      case 'i010':
            this.moneyw.i010 = this.moneyw.i010 + 1;
           break;
      case 'i005':
            this.moneyw.i005 = this.moneyw.i005 + 1;
           break;
    }
    this.aggiornaIncasso();
  }

  focusFunction() {

  }

  aggiungoResto(taglia: string) {
    switch (taglia)  {
      case 'r100':
        this.moneyw.r100 = this.moneyw.r100 + 1;
        break;
      case 'r050':
          this.moneyw.r050 = this.moneyw.r050 + 1;
          break;
      case 'r020':
          this.moneyw.r020 = this.moneyw.r020 + 1;
          break;
      case 'r010':
            this.moneyw.r010 = this.moneyw.r010 + 1;
           break;
      case 'r005':
            this.moneyw.r005 = this.moneyw.r005 + 1;
           break;
    }
    this.aggiornaResto();
  }

  tolgoResto(taglia: string) {
    switch (taglia)  {
      case 'r100':
        this.moneyw.r100 = this.moneyw.r100 - 1;
        break;
      case 'r050':
          this.moneyw.r050 = this.moneyw.r050 - 1;
          break;
      case 'r020':
          this.moneyw.r020 = this.moneyw.r020 - 1;
          break;
      case 'r010':
            this.moneyw.r010 = this.moneyw.r010 - 1;
           break;
      case 'r005':
            this.moneyw.r005 = this.moneyw.r005 - 1;
           break;
    }
    this.aggiornaResto();
  }


}





// --------------------  conteggi finali per chiusura e creaziuone commanda
/*
async RegistraProdottiCommanda()  {


  // attenzione     attenzione     attennzione
 // provvisorio qui per vedere se creo correttamente la nuova commanda
 // da spostare quando faccio il pagamento
 // devo fare anche la stampa della commanda

 await this.commandawService.getCommandaw(this.commandaw.id).subscribe(
  response => {
    this.commandaw = response['data'];
    if(this.commandaw.numProdotti > 0 ) {
             // recupero il giorno attivo
             this.letturaGiornataAttiva();

             // recupero il costo del coperto per calcolare quando addebitare

             this.loadManif(this.idDay);

             // recupero il numero della prossima Commanda
             this.loadLastCommanda();

             // conteggio prodotti e importi prodotti
             this.CalcolaProdottiAcquistati();

             //  crea la nuova commanda
             this.CreaNewCommanda();
             alert('RegistraNewCommanda --------CreataCommanda -----------  step4');
             //  crea righe commanda
             // this.CreaNewCommandaRighe();
       }  else {
         alert('devi ancora effettuare la selezione dei prodotti /n funzione non eseguibile');
         return;
       }
    },
    error => {
      this.isVisible  = true;
      this.Message = error.message;
      this.alertSuccess = false;
    alert('Manif-Data  --loadCommandaw: ' + error.message);
    console.log(error);
  }
)

}


RegistraeStampaCommanda() {
  alert('metodo da sistemare - quasi fatto');
}







// attenzione  Metodi da spostare in commandaw2-detail dove:
// effettuo il pagamente - genero la commanda e righe - stampo ricevuta


async letturaGiornataAttiva() {

await   this.giornataService.getGiornataactive().subscribe(
          response => {
//     alert('letto giornata attiva: ' + response['number'] ) ;
             if(response['number'] == 1) {
               this.giornata = response['data'];
      //         alert('idGiornata: ' + this.giornata.id);
               this.idDay = this.giornata.id;

      //         alert('idDay giornata attiva: ' + this.idDay ) ;

        } else {
        //
       }
   },
   error => {
      alert('commandaw1-detail  -- letturaGiornataAttiva - errore: ' + error.message);
      console.log(error);
   }
 )
}






   // recupero i dati della messa
   async loadManif(id: number) {
    // alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
    await  this.manifService.getManifestazione(id).subscribe(
    response => {
        this.manif = response['data'];
        this.newCommandaCoperto = this.manif.impCoperto;
    },
    error => {
    alert('Commandaw11-Detail  --loadManif: ' + error.message);
    console.log(error);
    }
  )

}

async loadLastCommanda()  {
await  this.commandaService.getLastCommandaid().subscribe(
  response => {

  //  alert('letto ultimo numero commanda');
    this.commanda = response['data'];

  },
  error => {
  alert('Commandaw1-Detail  --loadlastCommanda: ' + error.message);
  console.log(error);
  }
)

}

CalcolaProdottiAcquistati()  {

  //  da fare
  // test
  this.newCommandanProdotti = 15;
  this.newCommandaiProdotti = 25.50;


}


async  CreaNewCommanda() {

  this.commandanew = new Commanda();
  this.newCommandaid = this.commanda.id + 1;
  this.commandanew.id = this.newCommandaid;
  this.commandanew.anagrafica_cliente = this.commandaw.anagrafica_cliente;
  this.commandanew.idGiornata = this.idDay;
  this.commandanew.numTavolo = this.commandaw.numTavolo;
  this.commandanew.numPersone = this.commandaw.numPersone;
  this.commandanew.numProdotti =  this.newCommandanProdotti;
  this.commandanew.importoProdotti = this.newCommandaiProdotti;
  this.commandanew.importoCoperto = this.newCommandaCoperto * this.commandaw.numPersone;
  this.commandanew.dtCommanda = new Date();
  this.commandanew.stato = this.commandaw.stato;

  alert('--------------------------------------   pronto per scrivere nuova Commanda');




  await  this.commandaService.createCommanda(this.commandanew).subscribe(
    response =>  {
          if(response['success']) {
            this.commandanew = response['data'];
            alert('commanda ' + this.commanda.id + ' Creata con successo');
         } else {
           alert(response['message']);
         }
    },
    error => {
    alert('Commandawl-detail  --CreaNewCommanda: ' + error.message);
    console.log(error);
    }
  )
}


}


// -------------------------------------------

 CreaAllMoneyPaymant() {

    alert('creaAllMoneyPaymant - inizio');
    // salvo la situazione incassi e resti effettuati
    // -----------------------   Incassi e resto € 100
       if(this.moneyw.i100 > 0  || this.moneyw.r100 > 0) {
              this.taglia = 5;
              this.pezzi_i = this.moneyw.i100;
              this.pezzi_r = this.moneyw.r100;
              this.valore_i = this.moneyw.i100 * 100;
              this.valore_r = this.moneyw.r100 * 100;
             this.CreaMoneyPaymant(this.taglia, this.moneyw.i100, this.moneyw.r100, this.valore_i, this.valore_r);
       }



    // -----------------------   Incassi e resto € 50
        if(this.moneyw.i050 > 0  || this.moneyw.r050 > 0) {
              this.taglia = 4;
              this.pezzi_i = this.moneyw.i050;
              this.pezzi_r = this.moneyw.r050;
              this.valore_i = this.moneyw.i050 * 50;
              this.valore_r = this.moneyw.r050 * 50;
              this.CreaMoneyPaymant(this.taglia, this.moneyw.i050, this.moneyw.r050, this.valore_i, this.valore_r);
        }



    // -----------------------   Incassi e resto € 20

      if(this.moneyw.i020 > 0  || this.moneyw.r020 > 0)   {
          this.taglia = 3;
          this.pezzi_i = this.moneyw.i020;
          this.pezzi_r = this.moneyw.r020;
          this.valore_i = this.moneyw.i020 * 20;
          this.valore_r = this.moneyw.r020 * 20;
          this.CreaMoneyPaymant(this.taglia, this.moneyw.i020, this.moneyw.r020, this.valore_i, this.valore_r);
        }

    // -----------------------   Incassi e resto € 10
        if(this.moneyw.i010 > 0  || this.moneyw.r010 > 0)  {
          this.taglia = 2;
          this.pezzi_i = this.moneyw.i010;
          this.pezzi_r = this.moneyw.r010;
          this.valore_i = this.moneyw.i010 * 10;
          this.valore_r = this.moneyw.r010 * 10;
          this.CreaMoneyPaymant(this.taglia, this.moneyw.i010, this.moneyw.r010, this.valore_i, this.valore_r);
        }

    // -----------------------   Incassi e resto € 5
        if(this.moneyw.i005 > 0  || this.moneyw.r005 > 0)  {
          this.taglia = 1;
          this.pezzi_i = this.moneyw.i005;
          this.pezzi_r = this.moneyw.r005;
          this.valore_i = this.moneyw.i005 * 5;
          this.valore_r = this.moneyw.r005 * 5;
         this.CreaMoneyPaymant(this.taglia, this.moneyw.i005, this.moneyw.r005, this.valore_i, this.valore_r);
        }

     // -----------------------   Incassi e resto Moneta
       if(this.moneyw.icontante > 0  || this.moneyw.rcontante > 0)  {
        this.taglia = 6;
        this.pezzi_i = 0;
        this.pezzi_r = 0;
        this.valore_i = this.moneyw.icontante * 1;
        this.valore_r = this.moneyw.rcontante * 1;
        this.CreaMoneyPaymant(this.taglia, this.moneyw.icontante, this.moneyw.rcontante, this.valore_i, this.valore_r);
       }
       alert('creaAllMoneyPaymant - --------  fine');
        alert('--------------------        lancio il preview della commanda');
        this.router.navigate(['prewcommanda/' +  this.commanda.id]);
    }


   async CreaMoneyPaymant(taglia, pezzi_i, pezzi_r, importo_i, importo_r)  {

    alert('--------------------------------- creaMoneyPaymant - taglia: ' + taglia);
    alert('-----------  Pezzi_i  ------------------- creaMoneyPaymant  ' + pezzi_i);
    alert('-----------  Pezzi_r  ------------------- creaMoneyPaymant ' + pezzi_r);

      this.moneypayment = new Moneypayment();

     this.moneypayment.taglia = taglia;
     this.moneypayment.nro_pezzi_entrata = pezzi_i;
     this.moneypayment.nro_pezzi_uscita = pezzi_r;
     this.moneypayment.imp_entrata = importo_i;
     this.moneypayment.imp_uscita = importo_r;
     this.moneypayment.idGiornata = this.giornata.id;
     this.moneypayment.idCommanda = this.newCommandaid;
     this.moneypayment.key_utenti_operation = parseInt(localStorage.getItem('id'));

     alert('------------------------ preparato moneypayment per inserimento  - taglia: ' + taglia);

     await  this.moneypaymentService.createPayment(this.moneypayment).subscribe(
        response =>  {
              if(response['Ok']) {
                        alert('moneypayment per la commanda ' + this.newCommandaid + ' Creata con successo -----  da eliminare alert');
             } else {
               alert(response['message']);
             }
        },
        error => {
        alert('Commandaw2-detail  --CreaMoneyPaymant: ' + error.message);
        console.log(error);
        }
      )
   }


*/
