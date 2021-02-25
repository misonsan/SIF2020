import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// da eliminare
import { ProdottoService }  from '../../services/prodotto.service'; // ./../../services/fedele.service
import { Prodotto } from '../../classes/Prodotto';


import { Commandawriga } from '../../classes/commandawriga';
import { CommandawrigaService } from '../../services/commandawriga.service';
import { Ttipologia } from '../../classes/T_tipologia';
import { ActivatedRoute, Router } from '@angular/router';
import { TtipologiaService }  from './../../services/ttipologia.service';



@Component({
  selector: 'app-prodotti1',
  templateUrl: './prodotti1.component.html',
  styleUrls: ['./prodotti1.component.css']
})
export class Prodotti1Component implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public prodotti: Prodotto[] = [];    // eliminare
  public tipologie: Ttipologia[]  = [];

  @Output('updateProdotto') updateProdotto = new EventEmitter<Prodotto>();


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

  commandawrighe: Commandawriga[] = [];;
  // per paginazone
  p: number = 1;

  constructor(private prodottoService: ProdottoService,
              private commandawrigaService: CommandawrigaService,
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
           alert('Prodotti1  -- getProdottiforTipologia - errore: ' + error.message);
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
  this.getProdottiforTipologia(tipo);
  //alert('ho selezionato:' + tifedel + ' valore: ' + this.tipoRichiesta);

  }

      onSelectProdotto(prodotto: Prodotto){

         this.updateProdotto.emit(prodotto);

       }


}
