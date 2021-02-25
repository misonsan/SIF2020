import { Component, Input, OnInit } from '@angular/core';
import { CommandarigaService } from '../../services/commandariga.service';
import { Commandariga} from '../../classes/Commandariga';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'tr[app-commandarigalav]',
  templateUrl: './commandarigalav.component.html',
  styleUrls: ['./commandarigalav.component.css']
})
export class CommandarigalavComponent implements OnInit {

 // variabili passate dal componente padre

 @Input('commandarigalav-data') commandariga: Commandariga;
 @Input('commandarigalav-prog') i: number;


 faUserEdit = faUserEdit;
 faTrash = faTrash;
 faInfo = faInfo;
 faEuroSign = faEuroSign;
 faUtensils = faUtensils;
 faStream = faStream;
 faChartBar = faChartBar;
 faList = faList;
 routeGiornata = '';

 constructor(private commandarigaService: CommandarigaService, private route: Router) { }

 ngOnInit(): void {
 }

// mettere gli altri metodi

showDetailProdotto(id: number) {
  alert('da fare');
}

}
