import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Commandaw } from '../../classes/Commandaw';
import { Commandawriga } from '../../classes/Commandawriga';
import { Prodotto } from '../../classes/Prodotto';
import { Persona } from '../../classes/Persona';
import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { CommandawService }  from './../../services/commandaw.service';
import { ProdottoService } from './../../services/prodotto.service';
import { CommandawrigaService} from './../../services/commandawriga.service';
import { PersonaService } from './../../services/persona.service';

import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-commandaw-detail',
  templateUrl: './commandaw-detail.component.html',
  styleUrls: ['./commandaw-detail.component.css']
})
export class CommandawDetailComponent implements OnInit {

  public title = 'Registrazione Commanda  -  Commandaw-detail';

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


public manif: Manifestazione;
public giornata: Giornata;
public commandaw: Commandaw;
public prodotti: Prodotto[] = [];
public commandawriga: Commandawriga;
public persone: Persona[] = [];

public nRecMan = 0;
public nRec = 0;
public trovatoRec = false;
public tipoRichiesta = '?';
public ricManif = 0;
public validSearch = false;
private textMessage = '';
public nDay = 0;
public statoRic = 0;
public registrata = false;
public NCommanda = 0;

public personaleSanfra = false;
// per paginazone
p: number = 1;

constructor(private router: Router,
           private route: ActivatedRoute,
           private manifService: ManifestazioneService,
           private giornataService: GiornataService,
           private commandawService: CommandawService,
           private commandawrigaService: CommandawrigaService,
           private prodottoService: ProdottoService,
           private personaService: PersonaService
            ) { }

ngOnInit(): void {
  // nella url passo il codice della giornata
   this.isVisible  = false;
   this.registrata = false;
  // localStorage.setItem("UserCommanda", '10');   //  TEST


   this.commandaw = new Commandaw();
   this.route.paramMap.subscribe(p => {
   this.nDay = +p.get('id');
   // -------  leggo i dati della giornata
   this.loadGiornata(+p.get('id'));
   this.loadPersoneSanfra();
   });
}


async loadPersoneSanfra() {
  await this.personaService.getpersoneActive().subscribe(
    response => {
      this.persone = response['data'];
//      alert('il personale sanfra è di ' + response['number'] + ' persone');
     },
    error => {
      this.isVisible  = true;
      this.Message = error.message;
      this.alertSuccess = false;
    alert('commandaw-detail  --loadPersoneSanfra: ' + error.message);
    console.log(error);
    }
  )
}


async loadGiornata(id: number) {
   //   alert('loadGiornata - id:' + id);
   await this.giornataService.getGiornata(id).subscribe(
   response => {
     this.giornata = response['data'];
     this.loadManifestazione(this.giornata.idManifestazione);
     this.alertSuccess = true;
     this.Message = "Situazione Attuale";
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
   // alert('loadManifestazione - id:' + id + ' --  da giornata' + this.giornata.idManifestazione);
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

backToGiornata(){
// this.router.navigate(['users']); // rimandavo a elenco utenti
this.router.navigate(['manif/' + this.giornata.idManifestazione]);

}



ricercaCommande(){
alert(' da fare');
}

goProdotti()  {
//  alert('vado a  registrazione prodotti per la commanda: ---->  ' + this.commandaw.id);
  this.router.navigate(['commandaw1/' + this.commandaw.id]);
 }




resetForm(form) {
     this.commandaw = new Commandaw();
     const keyUser = localStorage.getItem("id");
     this.commandaw.id =   +keyUser;
  }


RegistraCommandaW()  {
//alert('registraCommandaW--------- Inizio ------- registraCommandaW');

// imposto stato in funzione se valorizzato il tavolo
if(this.commandaw.numTavolo == 0)  {
  this.commandaw.stato = 1;
} else {
  this.commandaw.stato = 2;
}

this.createCommanda(this.commandaw);
//this.router.navigate(['commandaw1/new']);
}

async createCommanda(commandaw: Commandaw)  {
  this.isVisible  = true;
// recupero da localstorage il livello utente loggato
  this.NCommanda = parseInt(localStorage.getItem('id'));

 // const keyUser = localStorage.getItem("id");
 // this.commandaw.id = +keyUser;
 this.commandaw.id = this.NCommanda;

 //alert('commandaw-CreateCommanda  ++++devo cancellare la vecchia commanda ------>  ' + this.commandaw.id );
//  attenzione da ripristinare quando sistemato il problema delete CRSF   2021/01/28
await  this.CancellaOldCommanda(commandaw.id)

//alert('commandaw-CreaCommanda  ++++++ effettuo la registrazione della nuova commanda ' + this.commandaw.id );

}


async CancellaOldCommanda(id)  {
// cancello la vecchia commanda con key utente loggato e poi salvo la nuova
 // alert('devo cancellare :' + id);

await this.commandawService.deleteCommanda(id).subscribe(
  response => {
   // alert('messaggio dopo cancellazione:' + response['message']);
      if(response['success']) {
     //   alert('EFFETTUATA LA CANCELLAZIONE');
          this.registraNewCommanda(this.commandaw);

        }  else {
          alert('record mancante - cancellazione non possibile - proseguo lo stesso');
       }
       // sentire da hidran perchè non passa


  },
  error =>
  {

   this.Message = error.message;
   this.alertSuccess = false;
    console.log(error);
  }
);
}

async  registraNewCommanda(commandaw: Commandaw) {

 // alert('commandaw - registraNewCommanda: --------------------------------> ' + commandaw.id );
//  commandaw.id = localStorage.getItem("UserCommanda");

  commandaw.importoCoperto = commandaw.numPersone * this.manif.impCoperto;
  // se personale in servizio azzero coperto
  if(this.commandaw.idSanfra != 0)  {
    this.commandaw.importoCoperto = 0;
    this.commandaw.buonoPasto = this.manif.buonoPastoCommanda;
  }
  this.commandaw.idGiornata = this.giornata.id;

  await this.commandawService.createCommanda(commandaw).subscribe(
    response => {
        if(response['success']) {
              this.registraCommandawrighe();


      //    il messaggio viene visualizzato sul dettaglio e il ritorno a elenco lo faccio a mano

      //    alert('Utente ' + user.name + ' Inserito   con successo');
     //     this.router.navigate(['users']);
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

async registraCommandawrighe() {
 // alert('--------------------------------     registraCommandaRighe')
    await this.prodottoService.getProdotti().subscribe(
      response => {
          if(response['number'] > 0) {            //  response['success']
            this.prodotti = response['data'];
      //   alert('----------   registraCommandaRighe  - trovate ' + response['number'] + ' prodotti da clonare');
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



  async crearigheCommanda() {

  //  alert('commandaW - creaarigheCommanda');
    let prg = 0;
    let keywidriga = 0;
    for(let prodo of this.prodotti) {
      this.commandawriga = new Commandawriga();
      prg = prg + 1;
      keywidriga = (this.commandaw.id * 100) + prg;

      this.commandawriga.id  = keywidriga;
      this.commandawriga.idCommanda = this.commandaw.id;
      this.commandawriga.idProdotto = prodo.id;
      this.commandawriga.descrizione_prodotto = prodo.descrizione_prodotto;
      this.commandawriga.tipologia = prodo.tipologia;
      this.commandawriga.categoria = prodo.categoria;
      this.commandawriga.competenza = prodo.competenza;
      this.commandawriga.disponibile_Day = prodo.disponibile_Day;
      this.commandawriga.scorta_minima = prodo.scorta_minima;
    //  prodo.prezzo_day = prodo.prezzo_day * 1;  // per normalizzare il campo che veniva estratto string
      this.commandawriga.prezzo_day = prodo.prezzo_day;
      this.commandawriga.photo = prodo.photo;
    //  this.commandawriga.d_Categoria = prodo.d_Categoria;

    await this.commandawrigaService.createCommandawriga(this.commandawriga).subscribe(
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

  onSelectionChange(ticli: string) {
    this.personaleSanfra = false;
    if(ticli == 'S') {
      this.personaleSanfra = true;
    }  else {
      this.personaleSanfra = false;
    }
  }


  onChangePersona(persona: Persona)  {
  //   alert('ho selezionato: ' + persona.cognome);
     this.commandaw.anagrafica_cliente = persona.cognome + ' ' + persona.nome;
     this.commandaw.idSanfra = persona.id;
  }

}


