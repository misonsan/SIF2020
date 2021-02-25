import { Component, Input, OnInit } from '@angular/core';
import { Commandariga } from 'src/app/classes/Commandariga';
import { CommandarigaService } from '../../services/commandariga.service';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'tr[app-commandariga]',
  templateUrl: './commandariga.component.html',
  styleUrls: ['./commandariga.component.css']
})
export class CommandarigaComponent implements OnInit {

    // variabili passate dal componente padre

    @Input('commandariga-data') commandariga: Commandariga;
    @Input('commandariga-prog') i: number;

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



}
