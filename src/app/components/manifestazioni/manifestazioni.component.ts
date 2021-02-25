import { Component, OnInit } from '@angular/core';

import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';

import { ManifestazioneService }  from './../../services/manifestazione.service'; // ./../../services/fedele.service
import { Manifestazione} from '../../classes/Manifestazione';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manifestazioni',
  templateUrl: './manifestazioni.component.html',
  styleUrls: ['./manifestazioni.component.css']
})

export class ManifestazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public manifestazioni: Manifestazione[] = [];

  public title = "elenco Manifestaszioni";
  public Message = '';
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;

 options = [
    'Tutte',
    'Attive',
    'Estinte'
  ];


  constructor(private manifService: ManifestazioneService,
              private router: Router) { }

ngOnInit(): void {

  //this.isVisible = false;
  this.loadManifestazioni();
}

async loadManifestazioni() {

  //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  await  this.manifService.getManifestazioni().subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      res => {
          this.manifestazioni = res['data'];
          this.nRec = res['number'];
          this.trovatoRec = true;
          this.Message = 'Situazione Attuale';
          this.alertSuccess = true;
     //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
       },
      error => {
         alert('Manifestazioni  -- loadManifestazioni - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      }
    )
}


registraManifestazione() {

 alert('devo registrae la nuova manifestazione');
// passare il valore della messa selezionata

// corrette  da ripristinare
// localStorage.setItem("gestioneutente", 'new');
this.router.navigate(['manif/new']);


}



// imposto il filtro di ricerca dei fedeli
onSelectionChange(tifedel: string)   {


this.tipoRichiesta = tifedel.substring(0,1);
this.validSearch = true;

//alert('ho selezionato:' + tifedel + ' valore: ' + this.tipoRichiesta);

}




ricercaManif() {

  alert(' da controllare');
  return;

// il campo messa.id è  del record presente this.messa.id

/*
if(this.tipoRichiesta == '?') {
this.validSearch = false;
alert('effettuare prima la selezione dei fedeli ,\n ricerca non possibile');
return;
}  else {
switch (this.tipoRichiesta) {

case 'T':      //login
this.router.navigate(['getfedeliforMessa', this.messa.id]);
break;
case "N":
case "E":
alert(' devo attivare rotta con n.ro messa e tipo fedeli');
this.router.navigate(['getfedeliforMessafiltro', this.messa.id, 'tipo', this.tipoRichiesta]);
break;
default:
alert('Scelta errata \n ricerca non possibile');
break;
}
}

// passare la url per effettuare la ricerca dei fedeli per tipologia
*/


}


}
