import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';
import { Prodotto } from '../../classes/Prodotto';

import { ActivatedRoute, Router } from '@angular/router';
import { ManifestazioneService} from './../../services/manifestazione.service';
import { GiornataService }  from './../../services/giornata.service';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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
// variabili per editazione messaggio
  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public textMessage1 = '';
  public textMessage2 = '';
  public textUser = '';
  public headerPopup = '';



 public manif: Manifestazione;
 public giornata: Giornata;

 constructor(private router: Router,
              private route: ActivatedRoute,
              private manifService: ManifestazioneService,
              private giornataService: GiornataService,
               ) { }

               ngOnInit(): void {
                this.giornata = new Giornata();
                this.route.paramMap.subscribe(p => {
                // -------  leggo i dati della giornata
                this.loadGiornata(+p.get('id'));

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


}





