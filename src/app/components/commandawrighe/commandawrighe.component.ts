import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Commandawriga } from '../../classes/Commandawriga';
import { CommandawrigaService } from '../../services/commandawriga.service';
import { Ttipologia } from '../../classes/T_tipologia';
import { ActivatedRoute, Router } from '@angular/router';
import { TtipologiaService }  from './../../services/ttipologia.service';


@Component({
  selector: 'app-commandawrighe',
  templateUrl: './commandawrighe.component.html',
  styleUrls: ['./commandawrighe.component.css']
})
export class CommandawrigheComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public commandawrighe: Commandawriga[] = [];;
  public tipologie: Ttipologia[]  = [];

  @Output('updateProdotto') updateProdotto = new EventEmitter<Commandawriga>();


  public title = "elenco Prodotti per Menu";
  public Message = '';
  public trovatoRec = false;
  public nRec = 0;
  public nRecTip = 0;
  public statotip = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public flagMenu = '';


  // per paginazone
  p: number = 1;

  constructor(private commandawrigaService: CommandawrigaService,
              private ttipologiaService: TtipologiaService,
              private router: Router) { }

  ngOnInit(): void {

    this.loadTipologie();

  }

  async loadTipologie() {
    this.statotip = 1;
    await  this.ttipologiaService.getTipologieforStato(this.statotip).subscribe(
      response => {
      this.tipologie = response['data'];
      this.nRecTip  = response['number'];
      this.trovatoRec = true;
      this.Message = 'Situazione Attuale';
      this.alertSuccess = true;
      },
      error => {
        this.isVisible  = true;
        this.Message = error.message;
        this.alertSuccess = false;
      alert('Prodotti1  --loadTipologie: ' + error.message);
      console.log(error);
      }
    )
  }


  async getProdottiforTipologia(tipo: number) {

    //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    await  this.commandawrigaService.getProdottiforTipologia(tipo).subscribe(
      // sentire hidran per lettura particolare
     // this.fedeleService.getFedeliforMessa(id).subscribe(
        res => {
            this.commandawrighe = res['data'];
       //     alert('test ----------------------- vedere le righe prodotte ');
            this.nRec = res['number'];
            this.trovatoRec = true;
            if(this.nRec == 0) {
              this.Message = 'Nessun prodotto per la tipologia selezionata';
            } else {
              this.Message = 'Situazione Attuale';
            }
            this.alertSuccess = true;
       //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
         },
        error => {
           alert('Commandawrighe  -- getProdottiforTipologia - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }

// imposto il filtro di ricerca dei fedeli
onSelectionChange(tipo: number)   {
  this.validSearch = true;
  this.flagMenu = this.tipoRichiesta;
  if(tipo != 99) {
    this.getProdottiforTipologia(tipo);
  } else {
    this.getProdottiOrdinati();
  }

}

  async getProdottiOrdinati() {

    //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    const userLogged = parseInt(localStorage.getItem('id'));
    await  this.commandawrigaService.getProdottiOrdinati(userLogged).subscribe(
      // sentire hidran per lettura particolare
     // this.fedeleService.getFedeliforMessa(id).subscribe(
        res => {
            this.commandawrighe = res['data'];
          //  alert('test ----------------------- vedere le righe prodotte ');
            this.nRec = res['number'];
            this.trovatoRec = true;
            if(this.nRec == 0) {
              this.Message = 'Nessun prodotto per la tipologia selezionata';
            } else {
              this.Message = 'Situazione Attuale';
            }
            this.alertSuccess = true;
       //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
         },
        error => {
           alert('Commandawrighe  -- getProdottiforTipologia - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }





  //alert('ho selezionato:' + tifedel + ' valore: ' + this.tipoRichiesta);



      onSelectProdotto(commandawriga: Commandawriga){

         this.updateProdotto.emit(commandawriga);

       }
}
