import { Component, Input, OnInit } from '@angular/core';
import { GiornataService } from '../../services/giornata.service';
import { Giornata} from '../../classes/Giornata';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GiornatapopComponent } from './../../components/popups/giornatapop/giornatapop.component';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'tr[app-giornata]',
  templateUrl: './giornata.component.html',
  styleUrls: ['./giornata.component.css']
})
export class GiornataComponent implements OnInit {

  @Input('giornata-data') giornata: Giornata;
  @Input('giornata-prog') i: number;

  faUserEdit = faUserEdit;
  faTrash = faTrash;
  faInfo = faInfo;
  faEuroSign = faEuroSign;
  faUtensils = faUtensils;
  faStream = faStream;
  faChartBar = faChartBar;
  faList = faList;
  faCalendarAlt = faCalendarAlt;

  routeGiornata = '';

  private dataOdierna: Date;
  private datepipe: DatePipe = new DatePipe('en-US');

  private dt1: string;
  private dt2: string;

  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public Message = '';


  constructor(public modal: NgbModal,
              private giornataService: GiornataService,
              private route: Router,
              public notifier: NotifierService) {
                this.notifier = notifier;
              }
              /* 
              constructor(public modal: NgbModal,
                private giornataService: GiornataService,
                private route: Router) {

                } */

  ngOnInit(): void {
    this.dataOdierna = new Date();
  }

  showGiornataDetail(giornata: Giornata) {

    //alert('Giornata - editare situazione di generale \n su giornata-data con visibile legato a parametro gestioneGiornata = show ');
    this.routeGiornata = '/giormanif/' + giornata.id;
    localStorage.setItem("SanfraGiornata", this.routeGiornata);
    this.route.navigate(['giormanif', giornata.id]);


    }

    showGiornataDetailCassa(giornata: Giornata) {

     //  alert('Giornata - editare situazione di cassaa \n su giornata-data con visibile legato a parametro gestioneGiornata = Cassa ');

     this.route.navigate(['giormanifcassa', giornata.id]);

      }

      showGiornataDetailProdotti(giornata: Giornata) {

        this.dt1 = this.datepipe.transform(giornata.dtGiornata, 'dd/MM/yyyy');
        this.dt2 = this.datepipe.transform(this.dataOdierna, 'dd/MM/yyyy');


        if(this.dt1 !== this.dt2) {

          this.type = 'error';
          this.Message = 'Data selezionata non Operativa';
          this.showNotification(this.type, this.Message);
          return;
        }
 
        /*     old test - sembra non funzioni - da verificare
        if(giornata.dtGiornata !== this.dataOdierna) {
          this.type = 'error';
          this.Message = 'Data selezionata non Operativa';
          this.showNotification(this.type, this.Message);
         // alert('data attuale non operativa');
          return;
        }  */

     //   alert('Giornata - editare situazione di prodotti \n su giornata-data con visibile legato a parametro gestioneGiornata = prodotti ');
       this.routeGiornata = 'giormanif/' + giornata.id;

       localStorage.removeItem("SanfraGiornata");
       localStorage.setItem('SanfraGiornata', JSON.stringify(this.giornata));
       // vecchia personalizzazione - non + valida dal 10/03/2021
      // localStorage.setItem("SanfraGiornata", this.routeGiornata);
       this.route.navigate(['giormanifprodotti', giornata.id]);
       }


       showGiornataDetailPersone(giornata: Giornata) {

        this.dt1 = this.datepipe.transform(giornata.dtGiornata, 'dd/MM/yyyy');
        this.dt2 = this.datepipe.transform(this.dataOdierna, 'dd/MM/yyyy');


        if(this.dt1 !== this.dt2) {

          this.type = 'error';
          this.Message = 'Data selezionata non Operativa';
          this.showNotification(this.type, this.Message);
          return;

      //    alert('data attuale non operativa dtGiornata: ' + this.dt1 + ' dataodierna: ' + this.dt2);
      //    return;
        }

      //  alert('Giornata - editare situazione di Persone \n su giornata-data con visibile legato a parametro gestioneGiornata = persone ');
       localStorage.removeItem("SanfraGiornata");
       localStorage.setItem('SanfraGiornata', JSON.stringify(this.giornata));
      // this.routeGiornata = 'giormanifpersone/' + this.giornata.id;
      // localStorage.setItem("SanfraGiornata", this.routeGiornata);

     //  alert('salvato localStorage per Persone');

       this.route.navigate(['giormanifpersone', this.giornata.id]);
       }

       showGiornataDetailCommande(giornata: Giornata) {


        this.dt1 = this.datepipe.transform(giornata.dtGiornata, 'dd/MM/yyyy');
        this.dt2 = this.datepipe.transform(this.dataOdierna, 'dd/MM/yyyy');


        if(this.dt1 !== this.dt2) {

          this.type = 'error';
          this.Message = 'Data selezionata non Operativa';
          this.showNotification(this.type, this.Message);
          return;
        }

      // controllo se giornata aperta
  
        if(this.giornata.stato !==  2) {
    
          this.type = 'error';
          this.Message = 'Giornata non Operativa - Registrazione commande non consentita';
          this.showNotification(this.type, this.Message);
          return;
        }
    
      //  alert('Giornata - editare situazione del Litino \n su giornata-data con visibile legato a parametro gestioneGiornata = Listino ');
       this.route.navigate(['commandeGiornata', giornata.id]);


      }

      // visualizzo la popup con la selezione della giornata
      showGiornata(giornata: Giornata) {

        const ref = this.modal.open(GiornatapopComponent, {size:'lg'});
        ref.componentInstance.selectedUser = giornata;
      
        ref.result.then(
          (yes) => {
            console.log('Click YES');
          },
          (cancel) => {
            console.log('click Cancel');
          }
        )

      }

      /**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}

}


