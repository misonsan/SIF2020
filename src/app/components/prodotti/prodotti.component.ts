import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProdottoService }  from '../../services/prodotto.service'; // ./../../services/fedele.service
import { Prodotto } from '../../classes/Prodotto';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.css']
})
export class ProdottiComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public prodotti: Prodotto[] = [];
  @Output('updateProdotto') updateProdotto = new EventEmitter<Prodotto>();

  public title = "elenco Prodotti per Menu";
  public Message = '';
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public flagMenu = '';

 options = [
    'Tutte',
    'Non a Menù',
    'A Menù'
  ];

  // per paginazone
  p: number = 1;

  constructor(private prodottoService: ProdottoService,
              private router: Router) { }

  ngOnInit(): void {
    this.tipoRichiesta = 'T';
    this.loadProdotti();
  }

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
           alert('Prodotti  -- loadProdottibyMenu - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }

// imposto il filtro di ricerca dei fedeli
onSelectionChange(menu: string)   {


  const menu1 = menu.substring(0,1);
  this.tipoRichiesta = menu1;
  this.validSearch = true;

  //alert('ho selezionato:' + tifedel + ' valore: ' + this.tipoRichiesta);

  }




  ricercaProdotti() {

    if(this.tipoRichiesta == '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del prodotto per Menuù ,\n ricerca non possibile');
        return;
        }  else {
          alert('la scelta della ricerca é: ' + this.tipoRichiesta);
              switch (this.tipoRichiesta) {
                  case 'T':
                  this.loadProdotti();
               //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                  break;
                  case 'N':
                  case 'A':
                    this.flagMenu = this.tipoRichiesta;
                    this.loadProdottibyMenu(this.tipoRichiesta);
                    break;
                  default:
                  alert('Scelta errata \n ricerca non possibile');
                  break;
            }
          }
      }

      onSelectProdotto(prodotto: Prodotto){

        this.updateProdotto.emit(prodotto);

       }

       /*
       async loadProdottibyMenu(amenu: string) {

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
               alert('Prodotto  -- loadProdottibyMenu - errore: ' + error.message);
               console.log(error);
               this.Message = error.message;
               this.alertSuccess = false;
            }
          )
      }   */
}

