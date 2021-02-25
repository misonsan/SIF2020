import { Component, OnInit } from '@angular/core';
import { Commanda } from '../../classes/Commanda';
import { Commandariga } from '../../classes/Commandariga';
import { Moneypay } from '../../classes/Moneypay';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandarigaService} from './../../services/commandariga.service';
import { MoneypayService }  from './../../services/moneypay.service';
import { CommandaService }  from './../../services/commanda.service';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faPlusSquare } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-commanda-data',
  templateUrl: './commanda-data.component.html',
  styleUrls: ['./commanda-data.component.css']
})
export class CommandaDataComponent implements OnInit {

  public title = "situazione Commanda";

  // definizione delle icone utilizzate
  faSave = faSave;
  faUndo = faUndo;
  faHandPointLeft = faHandPointLeft;
  faTrashAlt = faTrashAlt;
  faInfoCircle = faInfoCircle;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faSearch = faSearch;
  faPlusSquare = faPlusSquare;

// variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;

public textMessage1 = '';
public textMessage2 = '';
public textUser = '';
public nRec = 0;
public Message = '';

  public commandarighe: Commandariga[] = [];
  public moneypays: Moneypay[] = [];
  public moneypay: Moneypay;
  public commanda: Commanda;

  public searchText = '';

  public idCommanda = 0;
  // per paginazone
 p: number = 1;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private moneypayService: MoneypayService,
              private commandarigaService:CommandarigaService,
              private commandaService: CommandaService,) { }

  ngOnInit(): void {
    this.isVisible = false;
    this.route.paramMap.subscribe(p => {
      this.idCommanda = +p.get('id');
      // -------  leggo i dati della giornata
      this.loadCommanda(this.idCommanda)
       });
  }


  async loadCommanda(id: number) {
    //   alert('loadGiornata - id:' + id);
        this.isVisible = true;
          await this.commandaService.getCommanda(id).subscribe(
           response => {
             this.commanda = response['data'];
             this.loadCommandarighe(this.idCommanda);
             this.loadMoneypay(this.idCommanda);
             this.alertSuccess = true;
             this.Message = "Situazione Attuale";
           },
           error => {
             this.Message = error.message;
             this.alertSuccess = false;
           alert('Commanda-Data  --LoadCommanda: ' + error.message);
           console.log(error);
           }
         )

    }

   async  loadCommandarighe(id: number) {

      await this.commandarigaService.getProdottiforCommanda(id).subscribe(
        response => {
            this.commandarighe = response['data'];
            this.nRec = response['number'];
            this.alertSuccess = true;
            this.Message = 'Situazione Attuale - Nessun Prodotto ordinato';
            if(this.nRec > 0){
              this.Message = 'Situazione Attuale';
            }
        },
        error => {
        alert('Commanda-Data  --loadCommandaRighe: ' + error.message);
        console.log(error);
        }
      )

    }

  async  loadMoneypay(id: number) {

  await this.moneypayService.getMoneypayforCommanda(id).subscribe(
        response => {
            this.moneypays = response['data'];
            this.nRec = response['number'];
            this.alertSuccess = true;
            this.Message = 'Situazione Attuale - Nessuna movimentazione di denaro';
            if(this.nRec > 0){
              this.Message = 'Situazione Attuale';
            }
        },
        error => {
        alert('Commanda-Data  --loadMoneypay: ' + error.message);
        console.log(error);
        }
      )

    }


  }











