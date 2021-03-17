import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// component
import { Prodotto } from '../../classes/Prodotto';
import { TcategoriaProdotto } from '../../classes/T_categoria_prodotto';
import { TcompetenzaProdotto } from '../../classes/T_competenza_prodotto';
import { Ttipologia } from '../../classes/T_tipologia';
import { TstatoProdotto } from '../../classes/T_stato_prodotto';
// service
import { ProdottoService } from '../../services/prodotto.service';
import { TtipologiaService } from '../../services/ttipologia.service';
import { TcategoriaProdottoService } from '../../services/tcategoria-prodotto.service';
import { TcompetenzaProdottoService } from '../../services/tcompetenza-prodotto.service';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// seconda soluzione con popup component  - da fare popup
// import { ManifestazionepopComponent } from './../../components/popups/manifestazionepop/manifestazionepop.component';


@Component({
  selector: 'app-prodotti-anag',
  templateUrl: './prodotti-anag.component.html',
  styleUrls: ['./prodotti-anag.component.css']
})
export class ProdottiAnagComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public prodotti: Prodotto[] = [];
  public categorie: TcategoriaProdotto[] = [];
  public competenze: TcompetenzaProdotto[] = [];
  public tipologie: Ttipologia[] = [];

  public title = "elenco Prodotti - prodotti-anag works!";
  public Message = '';
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public ricercaIniziale = '';
  public isEnabledAll = false;
  public stato = 0;

  public idx = 0;
  public idxp= 0;

  public searchText = '';

 options = [
    'Generale',
    'Selettivo'
  ];

  optionsProdotto = [
    'Tutti',
    'Non Censito',
    'Attivo',
    'Bloccato'
  ];

  // per paginazone
  p: number = 1;

  constructor(private prodottoService: ProdottoService,
              private ttipologiaService: TtipologiaService,
              private tcategoriaProdottoService: TcategoriaProdottoService,
              private tcompetenzaProdottoService: TcompetenzaProdottoService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadTipologie();
    this.loadCategorieProdotti();
    this.loadCampetenzeProdotti();
    this.loadProdotti();
    this.ricercaIniziale = 'G';
    this.onSelectionChangeFiltro(this.ricercaIniziale);
    this.idx = 0;
  }

  loadProdotti() {

    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    this.prodottoService.getProdotti().subscribe(
      res => {
            this.prodotti = res['data'];
            this.nRec = res['number'];
            this.trovatoRec = true;
            this.Message = 'Situazione Attuale';
            this.alertSuccess = true;
       //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
         },
        error => {
           alert('Prodotti  -- loadProdotti - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }

  loadTipologie() {
 
    this.ttipologiaService.getTipolgie().subscribe(
      res => {
            this.tipologie = res['data'];
         },
        error => {
           alert('Prodotti  -- loadTipologie - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }

  loadCategorieProdotti() {
 
    this.tcategoriaProdottoService.getCategorie().subscribe(
      res => {
            this.categorie = res['data'];
         },
        error => {
           alert('Prodotti  -- loadCategorie - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }


  loadCampetenzeProdotti() {

    this.tcompetenzaProdottoService.getCompetenze().subscribe(
      res => {
            this.competenze = res['data'];
         },
        error => {
           alert('Prodotti  -- loadCampetenzeProdotti - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }



  onSelectionChangeFiltro(tiric: string)   {
    this.tipoRichiesta = tiric.substring(0,1);
    this.validSearch = true;
    switch (this.tipoRichiesta) {

      case 'G':
          this.isEnabledAll = true;
          break;
      case "S":
          this.isEnabledAll = false;
          break;
      }

    }

  

  onSelectionChangeProd(tiric: string) {
      this.tipoRichiesta = tiric.substring(0,1);
      this.validSearch = true;
      switch (this.tipoRichiesta) {
       case 'T':
           this.loadProdotti();
           break;
       case "N":
           this.stato = 0;
           this.loadProdottibyStato(this.stato);
           break;
       case 'A':
           this.stato = 1;
           this.loadProdottibyStato(this.stato);
           break;
       case "B":
           this.stato = 2;
           this.loadProdottibyStato(this.stato);
           break;
       }
   }

   loadProdottibyStato(stato: number) {
    this.prodottoService.getProdottiforStato(stato).subscribe(
      res => {
               this.prodotti = res['data'];
               this.nRec = res['number'];
               this.trovatoRec = true;
               if(this.nRec === 0) {
                this.Message = 'nessun prodotto per lo stato selezionato';
               } else {
                this.Message = 'situazione prodotti per lo stato selezionat';
               }
               this.alertSuccess = true;
             },
      error => {
               alert('Prodotti-anag  -- loadProdottibyStato - errore: ' + error.message);
               console.log(error);
               this.Message = error.message;
               this.alertSuccess = false;
             }
          );

   }



  

    //  this.loadManifestazionibyStato(this.stato);
    //alert('ho selezionato:' + tifedel + ' valore: ' + this.tipoRichiesta);



    selectedCompetenza(selectedValue: number) {
        this.loadTipologie();
        this.loadCategorieProdotti();
 
        this.prodottoService.getProdottiforCompetenza(selectedValue).subscribe(
        res => {
                 this.prodotti = res['data'];
                 this.nRec = res['number'];
                 this.trovatoRec = true;
                 if(this.nRec === 0) {
                  this.Message = 'nessun prodotto per la Competenza selezionata';
                 } else {
                  this.Message = 'situazione prodotti per Competenza';
                 }
                 this.alertSuccess = true;
               },
        error => {
                 alert('Prodotti-anag  -- selectedCompetenza - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
               }
            );
    }

    selectedTipologia(selectedValue: number) {
  
      this.loadCategorieProdotti();
      this.loadCampetenzeProdotti();
      this.prodottoService.getProdottiforTipologia(selectedValue).subscribe(
        res => {
                 this.prodotti = res['data'];
                 this.nRec = res['number'];
                 this.trovatoRec = true;
                 if(this.nRec === 0) {
                  this.Message = 'nessun prodotto per la Tipologia selezionata';
                 } else {
                  this.Message = 'situazione prodotti per Tipologia';
                 }
                 this.alertSuccess = true;
               },
        error => {
                 alert('Prodotti-anag  -- selectedTipologia - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
               }
            );
    }


    selectedCategoria(selectedValue: number) {
      // resetto la selezione precedente
      this.loadTipologie();
      this.loadCampetenzeProdotti();

      this.prodottoService.getProdottiforCategoria(selectedValue).subscribe(
        res => {
                 this.prodotti = res['data'];
                 this.nRec = res['number'];
                 this.trovatoRec = true;
                 if(this.nRec === 0) {
                  this.Message = 'nessun prodotto per la Categoria selezionata';
                 } else {
                  this.Message = 'situazione prodotti per Categoria';
                 }
                 this.alertSuccess = true;
               },
        error => {
                 alert('Prodotti-anag  -- selectedCategoria - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
               }
            );
     }






    registraProdotto() {
      alert('da fare');
    }

}
