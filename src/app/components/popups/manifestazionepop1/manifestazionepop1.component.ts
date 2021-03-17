import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Manifestazione} from '../../../classes/Manifestazione';

@Component({
  selector: 'app-manifestazionepop1',
  templateUrl: './manifestazionepop1.component.html',
  styleUrls: ['./manifestazionepop1.component.css']
})
export class Manifestazionepop1Component implements OnInit {

  manifestazione: Manifestazione;
  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.manifestazione);
  }

}
