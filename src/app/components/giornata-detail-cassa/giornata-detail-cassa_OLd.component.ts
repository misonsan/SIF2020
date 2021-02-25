import { Component, Input, OnInit } from '@angular/core';

import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-giornata-detail-cassa',
  templateUrl: './giornata-detail-cassa.component.html',
  styleUrls: ['./giornata-detail-cassa.component.css']
})
export class GiornataDetailCassaComponent implements OnInit {

  private giornatacopy;
  private __giornata;

 //  get - set
 @Input() set giornata(giornata: Giornata) {
  this.__giornata = giornata;
  this.giornatacopy = Object.assign({}, giornata);
}

get giornata() {
  return this.__giornata;
}
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

  public title = 'situagione giornaliera Cassa  -  giornata-detail-cassa works!';
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
  tinizio = 0;
  tattuale = 0;
  tfinale = 0;
  tsbilancio = 0;

  public enabledCassaFinale = false;
  public enabledCassaIniziale = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private manifService: ManifestazioneService,
              private giornataService: GiornataService,
               ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(p => {
         // -------  leggo i dati della giornata
          this.loadGiornata(+p.get('id'));
          // leggo i dati della manifestazione
            this.loadManifestazione(this.giornata.idManifestazione);
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

async loadGiornata(id: number) {
  alert('loadGiornata - id:' + id);
  await this.giornataService.getGiornata(id).subscribe(
    response => {
     this.giornata = response['data'];
     this.conteggiaValori();

     alert('loadGiornata - effettuato ricalcolo');
  },
  error => {
     alert('Manif-Data  --loadGiornata: ' + error.message);
     console.log(error);
  }
  )

}


ricalcolaValori(imp: number) {
  alert('ho modificato i dati di una cella' + imp);
  this.conteggiaValori();

}


// funziona ma non visualliza alert in caso di errore
onSearchChange(imp) {
 //  alert('--------------- ho modificato i dati di una cella' + imp);
  if (isNaN(imp)){
		alert('Il valore inserito non è numerico');
	} else {
		this.conteggiaValori();
	}

}

myFunctionOut(x) {

  x.style.background = "white";
  if (isNaN(x)){
		alert('Il valore inserito non è numerico');
	} else {
		this.conteggiaValori();
	}
}

myFunction(x) {

  x.style.background = "yellow";

}


conteggiaValori() {

  this.enabledCassaFinale = false;
  this.enabledCassaIniziale = false;

  switch (this.giornata.statoCassa) {
    case 0:
       this.enabledCassaFinale = false;
       this.enabledCassaIniziale = true;
       break;
    case 1:
       this.enabledCassaFinale = true;
       this.enabledCassaIniziale = false;
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

}

save() {
  alert('cassa-salva    da fare');
  if (this.giornata.id > 0) {
    this.updateGiornataCassa(this.giornata);
} else {
    this.createGiornataCassa(this.giornata);
}
  this.savechange = true;
  this.alertSuccess = true;

}

resetForm(form) {
  alert('cassa-reset form  -  da fare');

  if (this.giornata.id === 0) {
    this.giornata = new Giornata();
  } else {
    this.giornata = this.giornatacopy;
  }



}

backToGiornata(){
  // this.router.navigate(['users']); // rimandavo a elenco utenti
   this.router.navigate(['manif/' + this.giornata.idManifestazione]);

}

updateGiornataCassa(giornata: Giornata) {
   alert('cassa- sono in update cassa -  da fare');

   /*
  this.messaService.updateMessa(this.messa).subscribe(
      response => {
          if(response['success']) {
             this.message = 'Messa ' + messa.demessa + ' Modificata con successo';
           //  alert(this.message);
          //   this.router.navigate(['users']);
          } else {
            alert(response['message']);
            this.alertSuccess = false;
          }
      },
      error =>
      {
        console.log(error);
        this.alertSuccess = false;
      }
    );

   */
}

createGiornataCassa(giornata: Giornata)  {
  alert('cassa- sono in create cassa -  da fare');
  /*
 this.messaService.createMessa(this.messa).subscribe(
      response => {
          if(response['success']) {
            this.message = 'Messa ' + messa.demessa + ' Inserita   con successo';

        //    il messaggio viene visualizzato sul dettaglio e il ritorno a elenco lo faccio a mano

        //    alert('Utente ' + user.name + ' Inserito   con successo');
       //     this.router.navigate(['users']);
          } else {
            alert(response['message']);
             this.alertSuccess = false;
           }
      },
      error =>
      {
        console.log(error);
        this.alertSuccess = false;
      }
    );


  */

}



}






