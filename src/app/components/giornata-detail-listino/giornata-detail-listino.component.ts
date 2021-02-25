import { Component, OnInit } from '@angular/core';
import { Manifestazione} from '../../classes/Manifestazione';
import { Giornata } from '../../classes/Giornata';

@Component({
  selector: 'app-giornata-detail-listino',
  templateUrl: './giornata-detail-listino.component.html',
  styleUrls: ['./giornata-detail-listino.component.css']
})
export class GiornataDetailListinoComponent implements OnInit {

  public title = 'situagione giornaliera Listino';

  constructor() { }

  ngOnInit(): void {
  }

}
