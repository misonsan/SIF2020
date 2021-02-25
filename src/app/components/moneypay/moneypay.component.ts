
import { Component, Input, OnInit } from '@angular/core';
import { Moneypay } from 'src/app/classes/Moneypay';
import { MoneypayService } from '../../services/moneypay.service';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'tr[app-moneypay]',
  templateUrl: './moneypay.component.html',
  styleUrls: ['./moneypay.component.css']
})

export class MoneypayComponent implements OnInit {

    // variabili passate dal componente padre

    @Input('moneypay-data') moneypay: Moneypay;
    @Input('moneypay-prog') i: number;

    faUserEdit = faUserEdit;
    faTrash = faTrash;
    faInfo = faInfo;
    faEuroSign = faEuroSign;
    faUtensils = faUtensils;
    faStream = faStream;
    faChartBar = faChartBar;
    faList = faList;
    routeGiornata = '';

     constructor(private moneypayService: MoneypayService, private route: Router) { }

    ngOnInit(): void {
    }

}
