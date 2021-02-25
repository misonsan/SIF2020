import { Component, Input, OnInit } from '@angular/core';
import { GiornataService } from '../../services/giornata.service';
import { Giornata} from '../../classes/Giornata';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


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
  routeGiornata = '';

  constructor(private giornataService: GiornataService, private route: Router) { }

  ngOnInit(): void {
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

     //   alert('Giornata - editare situazione di prodotti \n su giornata-data con visibile legato a parametro gestioneGiornata = prodotti ');
       this.routeGiornata = 'giormanif/' + giornata.id;
       localStorage.setItem("SanfraGiornata", this.routeGiornata);
       this.route.navigate(['giormanifprodotti', giornata.id]);
       }


       showGiornataDetailPersone(giornata: Giornata) {

      //  alert('Giornata - editare situazione di Persone \n su giornata-data con visibile legato a parametro gestioneGiornata = persone ');
       localStorage.removeItem("SanfraGiornata");
       localStorage.setItem('SanfraGiornata', JSON.stringify(this.giornata));
      // this.routeGiornata = 'giormanifpersone/' + this.giornata.id;
      // localStorage.setItem("SanfraGiornata", this.routeGiornata);

     //  alert('salvato localStorage per Persone');

       this.route.navigate(['giormanifpersone', this.giornata.id]);
       }

       showGiornataDetailCommande(giornata: Giornata) {

      //  alert('Giornata - editare situazione del Litino \n su giornata-data con visibile legato a parametro gestioneGiornata = Listino ');
       this.route.navigate(['commandeGiornata', giornata.id]);


      }


}


