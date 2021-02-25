import { Component, Input, OnInit } from '@angular/core';
import { Persona } from '../../classes/Persona';
import { Giornata } from '../../classes/Giornata';

import { Truoloday } from '../../classes/T_ruolo_day';
import { faPlusSquare, faSearch, faSave, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { PersonaService }  from './../../services/persona.service';
import { TruolodayService }  from './../../services/truoloday.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

/*    buttare
interface Ruoli {
  value: number;
  dRuolo: string;
}
  */

@Component({
  selector: 'app-persona-detail',
  templateUrl: './persona-detail.component.html',
  styleUrls: ['./persona-detail.component.css']
})
export class PersonaDetailComponent implements OnInit {

    //ricevo ti dati dal componente padre (persona)
    @Input() persona: Persona;


    public giornata: Giornata;      // serve per importare la giornata per eseguire route a pagina attuale (refesh simulato)
    public ruoli: Truoloday[] = [];
    public pathImage =  'assets/images/photo/';
    public title = "Situazione Personale";
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

    public routeNavigate = 'giormanifpersone';

  /*    buttare
    ruoli: Ruoli[] = [
      {value: 0, dRuolo: 'Nessun Ruolo'},
      {value: 1, dRuolo: 'Responsabile Cassa'},
      {value: 2, dRuolo: 'Responsabile Cucina'},
      {value: 3, dRuolo: 'Responsabile Bevande'},
      {value: 4, dRuolo: 'Responsabile Sala'},
      {value: 5, dRuolo: 'Cameriere/a'},
      {value: 6, dRuolo: 'Addetto Cucina'},
      {value: 7, dRuolo: 'Responsabile Caffe'},
      {value: 8, dRuolo: 'Yolly'},
      {value: 99, dRuolo: 'Non Operativo'},
    ];
    */




  constructor(private personaService: PersonaService,
              private ruoloService: TruolodayService,
              private route: ActivatedRoute,
              private router: Router) { }

              ngOnInit(): void {
                this.isVisible = false;
                this.isSelected = false;
                this.displayedImage = this.pathImage + '0.jpg';
                 this.loadRuoli();
             }


 // recupero i ruoli
async loadRuoli() {
      await  this.ruoloService.getRuoli().subscribe(
       response => {
           this.ruoli = response['data'];
       },
       error => {
          alert('Persona-Detaail  --loadRuoli: ' + error.message);
          console.log(error);
       })
    }

    onChange(deviceValue) {
      if(deviceValue == 999) {
        alert('Effettuare la selezione !!');
        this.isSelected = false;
        return;
      }

      this.isSelected = true;
      this.persona.idRuolo_Day = deviceValue;
    }


    Salva(deviceValue) {
      if(deviceValue == 999) {
        alert('Selezione non ammessa  \n aggiornamento non possibile !!');
        this.isSelected = false;
        return;
      }  else {
        this.updateRuoloPersona(this.persona);

      }

    }

  async  updateRuoloPersona(persona: Persona) {
  //alert('cassa- sono in update cassa -  da fare');

       this.isVisible = true;
       this.persona.inServizio = "S";
   await  this.personaService.updatePersona(persona).subscribe(
         response => {
             if(response['success']) {
                this.Message = 'Aggiornato correttamente il ruolo per  ' + persona.cognome;
                this.alertSuccess = true;

                this.giornata = JSON.parse(window.localStorage.getItem("SanfraGiornata")),

            //    alert('Persona-DetAIL -  UpdateRuolo - Giornata: ' + this.giornata.id);

            //    alert('la rotta ricostruita è: ' + this.routeNavigate + this.giornata.id);
              //   alert('Persona-Detail  routerNavigate: ' + this.routeNavigate);

                 this.router.navigate(['giormanifpersone', this.giornata.id]);

alert('persona-detail   dovrebbe aver fatto route');

              //  alert(this.message);
             //   this.router.navigate(['users']);
             } else {
               alert(response['message']);
               this.Message = response['message'];
               this.alertSuccess = false;
             }
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
