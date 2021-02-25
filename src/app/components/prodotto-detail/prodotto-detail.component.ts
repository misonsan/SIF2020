import { Component, Input, OnInit } from '@angular/core';
import { Prodotto } from '../../classes/Prodotto';
import { Giornata } from '../../classes/Giornata';
import { faPlusSquare, faSearch, faSave, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { ProdottoService }  from './../../services/prodotto.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

interface EnableProd {
  value: string;
  dEnable: string;
}

@Component({
  selector: 'app-prodotto-detail',
  templateUrl: './prodotto-detail.component.html',
  styleUrls: ['./prodotto-detail.component.css']
})
export class ProdottoDetailComponent implements OnInit {

    //ricevo ti dati dal componente padre (Prodotto)
    @Input() prodotto: Prodotto;

    public giornata: Giornata;      // serve per importare la giornata per eseguire route a pagina attuale (refesh simulato)

    public pathImage =  'assets/images/photoProducts/';
    public title = "Situazione Prodottole";
    public displayedImage = '';
    //public user: User;

// icone
    faPlusSquare = faPlusSquare;
    faSearch = faSearch;
    faSave = faSave;
    faUserEdit = faUserEdit;

    // variabili per editazione messaggio
    public alertSuccess = false;
    public savechange = false;
    public isVisible = false;

    public nRecMan = 0;
    public nRec = 0;
    public trovatoRec = false;
    public Message = '';
    public isSelected = false;

    public saveValueStd:boolean;

    enabledProd: EnableProd[] = [
      {value: '?', dEnable: 'Selezionare se a Menu'},
      {value: 'N', dEnable: 'Non a Menu'},
      {value: 'S', dEnable: 'A Menu'},
     ];

     constructor(private prodottoService: ProdottoService,
      private route: ActivatedRoute,
      private router: Router) { }

      ngOnInit(): void {
        this.isVisible = false;
        this.isSelected = false;
        this.displayedImage = this.pathImage + '0.jpg';
        this.saveValueStd = false;
     }

     /*
     onChange(deviceValue) {
      if(deviceValue == '?') {
        alert('Effettuare la selezione !!');
        this.isSelected = false;
        return;
      } else {
        this.isSelected = true;
      }
     }  */



     onSaveValueStdChanged(value:boolean){
        this.saveValueStd = value;

    //    alert('esito checkbox: ' + value);
        if (value) {
          this.prodotto.disponibile_Day = this.prodotto.disponibile;
          this.prodotto.prezzo_day = this.prodotto.prezzo;
        } else {
          this.prodotto.disponibile_Day = 0;
          this.prodotto.prezzo_day = 0;
        }

    }



     onOptionsSelected(value:string){

        if(value == '?') {
          alert('Effettuare la selezione !!');
          this.isSelected = false;
          return;
        } else {
          this.isSelected = true;
        }
     }


    Salva(value) {
      if(value == '?') {
        alert('Selezione non ammessa  \n aggiornamento non possibile !!');
        this.isSelected = false;
        return;
      }  else {

        this.prodotto.aMenu = value;
        if(value == 'N') {
          this.prodotto.disponibile_Day = 0;
          this.prodotto.prezzo_day = 0;
        }
        this.updateMenuProdotto(this.prodotto);
      }
    }

  async  updateMenuProdotto(prodotto: Prodotto) {
  //alert('cassa- sono in update cassa -  da fare');
  await  this.prodottoService.updateProdotto(prodotto).subscribe(
         response => {
             if(response['success']) {
                 this.rileggiProdotto(prodotto);
          /*
             } else {
               alert(response['message']);
               this.Message = response['message'];
               this.alertSuccess = false;
             }*/
         }},
         error =>
         {
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
         }
      );
  }


async  rileggiProdotto(prodotto: Prodotto) {
  //alert('cassa- sono in update cassa -  da fare');

       this.isVisible = true;

   await  this.prodottoService.getProdotto(prodotto.id).subscribe(
         response => {
              this.prodotto = response['data'];
              this.Message = 'Prodotto: ' + prodotto.descrizione_prodotto + 'Aggiornato correttamente  ';
              this.alertSuccess = true;
          },
         error =>
         {
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
         }
      );
  }




}

