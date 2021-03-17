import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Prodotto } from '../../classes/Prodotto';

import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { ProdottoService }  from '../../services/prodotto.service'; // ./../../services/fedele.service


@Component({
  selector: 'app-giornata-detail-prodotti',
  templateUrl: './giornata-detail-prodotti.component.html',
  styleUrls: ['./giornata-detail-prodotti.component.css']
})
export class GiornataDetailProdottiComponent implements OnInit {

  public title = 'situagione giornaliera Prodotti';

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
  public trovatoRec = false;
  public nRec = 0;
 
  public tipoRichiesta = '?';
  public validSearch = false;
  public flagMenu = '';
  
// -------------------

 public manif: Manifestazione;
 public giornata: Giornata;
 public prodotti: Prodotto[] = [];
 public prodotto: Prodotto;

 options = [
  'Tutte',
  'Da Selezionare',
  'Non a Menù',
  'A Menù'
];

// per paginazone
p: number = 1;

 constructor(private router: Router,
              private route: ActivatedRoute,
              private manifService: ManifestazioneService,
              private giornataService: GiornataService,
              private prodottoService: ProdottoService
               ) { }

               ngOnInit(): void {
                this.giornata = new Giornata();
                this.route.paramMap.subscribe(p => {
                // -------  leggo i dati della giornata
                this.loadGiornata(+p.get('id'));
                this.tipoRichiesta = 'T';
                this.loadProdotti();
                     // alert('GiornataDetailPersone - loadGiornata - finito OnInit');
                });
          }
          async loadGiornata(id: number) {
                //   alert('loadGiornata - id:' + id);
                await this.giornataService.getGiornata(id).subscribe(
                response => {
                this.giornata = response['data'];
                 // leggo i dati della manifestazione
                this.loadManifestazione(this.giornata.idManifestazione);

                },
                error => {
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
                alert('Manif-Data  --loadManifestazione: ' + error.message);
                console.log(error);
                }
              )

          }

          backToGiornata(){
          // this.router.navigate(['users']); // rimandavo a elenco utenti
          this.router.navigate(['manif/' + this.giornata.idManifestazione]);

          }




          prodottoSelected: Prodotto;
          updateProdotto(prodotto: Prodotto){
            this.prodottoSelected = prodotto;
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
          if(this.tipoRichiesta === 'A') {
            this.tipoRichiesta = 'S';
          }
          if(this.tipoRichiesta === 'D') {
            this.tipoRichiesta = '*';
          }
          this.validSearch = true;

          switch (this.tipoRichiesta) {
            case 'T':
            this.loadProdotti();
         //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
            break;
            case 'N':
            case 'S':
            case '*':
              this.flagMenu = this.tipoRichiesta;
              this.loadProdottibyMenu(this.tipoRichiesta);
              break;
            default:
            alert('Scelta errata \n ricerca non possibile');
            break;
          }
      }

        /*
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
        */

}





