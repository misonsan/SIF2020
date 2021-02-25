import { Component, Input, OnInit } from '@angular/core';
import { CommandaService } from '../../services/commanda.service';
import { Commanda} from '../../classes/Commanda';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'tr[app-commanda]',
  templateUrl: './commanda.component.html',
  styleUrls: ['./commanda.component.css']
})
export class CommandaComponent implements OnInit {

  // variabili passate dal componente padre

  @Input('commanda-data') commanda: Commanda;
  @Input('commanda-prog') i: number;


  faUserEdit = faUserEdit;
  faTrash = faTrash;
  faInfo = faInfo;
  faEuroSign = faEuroSign;
  faUtensils = faUtensils;
  faStream = faStream;
  faChartBar = faChartBar;
  faList = faList;
  routeGiornata = '';

  constructor(private commandaService: CommandaService, private route: Router) { }

  ngOnInit(): void {
  }


  showCommandaDetail(id: number) {


    alert('da fare - forma tabset');
    this.route.navigate(['commanda/' + id + '/show']);
    //alert('Giornata - editare situazione di generale \n su giornata-data con visibile legato a parametro gestioneGiornata = show ');
    /*

    this.routeGiornata = '/giormanif/' + this.giornata.id;
    localStorage.setItem("SanfraGiornata", this.routeGiornata);
    this.route.navigate(['giormanif', this.giornata.id]);


    }   */

}

goDetail(id: number)  {

  alert('effettuo qui la lettura della commanda /n per poi editarla nella popup');

  this.loadCommanda(id);
}



async loadCommanda(id: number) {
  //   alert('loadGiornata - id:' + id);

        await this.commandaService.getCommanda(id).subscribe(
         response => {
           this.commanda = response['data'];

         },
         error => {

         alert('Commanda-Data  --LoadCommanda: ' + error.message);
         console.log(error);
         }
       )

  }






}

