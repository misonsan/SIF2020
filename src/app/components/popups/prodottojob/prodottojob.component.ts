import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Prodotto } from '../../../classes/Prodotto'            
import { Giornata } from '../../../classes/Giornata';
import { Commandariga } from '../../../classes/Commandariga';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProdottoService }  from './../../../services/prodotto.service';
import { CommandarigaService }  from './../../../services/commandariga.service';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-prodottojob',
  templateUrl: './prodottojob.component.html',
  styleUrls: ['./prodottojob.component.css']
})
export class ProdottojobComponent implements OnInit {

  public prodotto: Prodotto;
  public commandariga: Commandariga;

  public giornata: Giornata;      // serve per importare la giornata per eseguire route a pagina attuale (refesh simulato)

  public title = "Selezione Prodotti";

  //public user: User;

// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;

  // variabili per editazione messaggio
  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;
  public Message = '';
  public isSelected = false;

  public saveValueStd: boolean;

  public selectedUser: Commandariga;
  public editForm: FormGroup;
  public isLoading = false;
  public fase = '';
  public tipo = '';
  public interval = 'minutes';
  public mm = 0;
  public date1 = null;
  public date2 = null;

   constructor(public modal: NgbActiveModal,
               private prodottoService: ProdottoService,
               private commandarigaService: CommandarigaService,
               private route: ActivatedRoute,
               private router: Router,
               private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // quando ricevo il controllo devo leggere il prodotto per
    // poterlo editare

    console.log('dati passati da chiamante: ' + this.commandariga.id );
    this.setForm();
  }

  onSubmit() {
   /* if (this.editForm.invalid || this.isLoading) {
      return;
    } */

    if(this.fase === 'job') {
      this.selectedUser.flag_lavorazione = 1;
    }
    if(this.fase === 'coc') {
      this.selectedUser.flag_consegna = 1;
    }
    if(this.fase === 'cob') {
      this.selectedUser.flag_consegna = 1;
    }

    this.isLoading = true;

  // mettere il ricalcolo del delay per aggiornare in tabella


    this.commandarigaService.updateCommandariga(this.editForm.value).subscribe(x => {
      this.isLoading = false;
      this.modal.close('Yes');
    },
      error => {
        this.isLoading = false;
      });
  }


  get editFormData() { return this.editForm.controls; }

  // versione senza leggere i dati da prodotto   ---  funziona
  /*
  private setForm() {
    this.selectedUser = this.commandawriga;       // <--------------------------------------------   
    // console.log(' selectduserPassato a popup : ' + this.selectedUser);
    console.log(' selectduserPassato a popup1 : ' + this.selectedUser.id);
     // leggo i dati da prodotto
    // i campi relativi a commandawriga sono gia pronti
       
    this.editForm = this.formBuilder.group({
    
      id: [this.selectedUser.id],
      qta: [this.selectedUser.qta, Validators.required],
      desprodotto: [this.selectedUser.descrizione_prodotto],
      prezzo: [this.selectedUser.prezzo_day],
      disponibile: [this.selectedUser.disponibile_Day]  

     });
  }
*/






 // versione popolando la form dopo aver letto i dati da prodotto
 private setForm() {
 
// impostazione testata
  if(this.commandariga.competenza === 1 && this.commandariga.flag_lavorazione === 0) {
    this.title = "Lavorazione Prodotti";
    this.fase = 'job';
    this.date1 = this.commandariga.created_at;
    this.date2 = new Date();
  }
  if(this.commandariga.competenza === 1 && this.commandariga.flag_lavorazione === 1 && this.commandariga.flag_consegna === 0) {
    this.title = "Consegna Prodotti Cucina";
    this.fase = 'coc';
    this.date1 = this.commandariga.ora_lavorazione;
    this.date2 = new Date();
  }
  if(this.commandariga.competenza === 2 &&  this.commandariga.flag_consegna === 0) {
    this.title = "Consegna Prodotti Bevande";
    this.fase = 'cob';
    this.date1 = this.commandariga.created_at;
    this.date2 = new Date();
  }
  this.calcolaDelay(this.fase, this.date1, this.date2);
  this.selectedUser = this.commandariga;

  // nel caso debba effettuare delle letture su altre tabelle non creare metodo dove leggo e poi compilo la form,
  // ma portare la lettura del service qui e su res =>  effettuare la compilazione della form   <-------  Importante ----->
  this.prodottoService.getProdotto(this.selectedUser.idProdotto).subscribe(
    res => {
        this.prodotto = res['data'];
        this.editForm = this.formBuilder.group({
          id: [this.selectedUser.id],
          qta: [this.selectedUser.qta_ord, Validators.required],
          desprodotto: [this.selectedUser.descrizione_prodotto],
          delayjob: [this.selectedUser.delayLavorazione],
          delaycoc: [this.selectedUser.delayConsegna],
          delaycob: [this.selectedUser.delayConsegna],
          semaphoreLavorazione: [this.selectedUser.semaphoreLavorazione],
          semaphoreConsegna: [this.selectedUser.semaphoreConsegna],
          prezzo: [this.selectedUser.prezzo]
         });
       // console.log('ho letto il prodotto da editare: ' + this.selectedUser.idProdotto);
       // alert('ho letto il prodotto da editare: ' + this.selectedUser.idProdotto);
       },
    error => {
       alert('Prodotto1DetailPopup  -- setForm - errore: ' + error.message);
       console.log(error);
    });
}

calcolaDelay(fase: string, date1: Date, date2: Date) {

  this.mm = 60 - this.getDateDiff(this.date2, this.date1, this.interval);

  if(this.mm > 999) {
    this.mm = 999;
  }

 // console.log('minutes: -----------------> ' + mm);

  switch (fase) {
     case 'job':
        this.commandariga.delayLavorazione  = this.mm;
        if(this.mm <= 10) {
            this.commandariga.semaphoreLavorazione = 'verde.jpg';
          } else if(this.mm > 10 && this.mm <= 15) {
            this.commandariga.semaphoreLavorazione = 'azzurro.jpg';
          } else if(this.mm > 15 && this.mm <= 20) {
            this.commandariga.semaphoreLavorazione = 'giallo.jpg';
          } else if(this.mm > 20 && this.mm <= 25) {
            this.commandariga.semaphoreLavorazione = 'arancio.jpg';
          }else {
            this.commandariga.semaphoreLavorazione = 'viola.jpg';
          }
        break;
        case 'coc':
        case 'cob':
          this.commandariga.delayConsegna  = this.mm;
          if(this.mm <= 10) {
              this.commandariga.semaphoreConsegna = 'verde.jpg';
            } else if(this.mm > 10 && this.mm <= 15) {
              this.commandariga.semaphoreConsegna = 'azzurro.jpg';
            } else if(this.mm > 15 && this.mm <= 20) {
              this.commandariga.semaphoreConsegna = 'giallo.jpg';
            } else if(this.mm > 20 && this.mm <= 25) {
              this.commandariga.semaphoreConsegna = 'arancio.jpg';
            }else {
              this.commandariga.semaphoreConsegna = 'viola.jpg';
            }
          break;
 }

}

getDateDiff(date1, date2, interval) {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  date1 = new Date(date1).getTime();
  date2 = new Date(date2).getTime();

 // date2 = (date2 == 'now') ? new Date().getTime() : new Date(date2).getTime();

  var timediff = date2 - date1;

  if (isNaN(timediff)) return NaN;

  switch (interval) {
            // case "years":
            //   return date2.getFullYear() - date1.getFullYear();
            // case "months":
            //   return ((date2.getFullYear() * 12 date2.getMonth()) - (date1.getFullYear() * 12 date1.getMonth()));
            // case "weeks":
            //    return Math.floor(timediff / week);
          //    case "days":
          //    return Math.floor(timediff / day);
          //    case "hours":
          //    return Math.floor(timediff / hour);
              case "minutes":
              return Math.floor(timediff / minute);
          //    case "seconds":
          //    return Math.floor(timediff / second);
          //    default:
          //    return undefined;

        }

  }









  /*  vecchia maniera      non viene usata
  async getProdottoSelected(id: number) {
    await   this.prodottoService.getProdotto(id).subscribe(
        res => {
            this.prodotto = res['data'];
            console.log('ho letto il prodotto da editare: ' + id);
            alert('ho letto il prodotto da editare: ' + id);
           },
        error => {
           alert('commandawriga  -- getProdottoSelected - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }  */

  /*
  async getProdottoSelected(id: number) {

     non serve che faccio la lettura su prodotto
    try {
      const resp = await this.prodottoService.getProdotto(id).toPromise();
      this.prodotto = resp['data'];
      console.log('ho letto il prodotto da editare: ' + id);
      alert('ho letto il prodotto da editare: ' + id);

    } catch (e) {
      switch (e.status) {
        case 401:
            alert(e.error.error);
        case 404:
          alert(e.statusText)
          break;
        case 500:
          alert('error contacting server')
          break;
    }

  }

}   */


//  video  https://www.youtube.com/watch?v=XnSYkbRnVHE&feature=youtu.be
// minuto 5
// non passo commandawriga e quindi non edito un cazzo

//  https://github.com/AlphaTechstudios/Forms/blob/Edit_Modal/src/app/PopUp/edit-user/edit-user.component.html#L4

}


/* 


  async signIn(form: NgForm) {
    if(!form.valid){
      return false;
    }
 try {
   const resp = await this.auth.signIn(form.value.email, form.value.password)
     .toPromise();
   alert(resp.user_name + ' logged in successfully');
   this.router.navigate(['/']);
   ;
 } catch (e) {
      switch (e.status) {
        case 401:
            alert(e.error.error);
        case 404:
          alert(e.statusText)
          break;
        case 500:
          alert('error contacting server')
          break;
      }

 }
   /*this.auth.signIn(form.value.email, form.value.password)
     .subscribe(
       (payload: Jwt) => {
          alert('login successful');
         this.router.navigate(['/']);
       },
       ({error}) =>{
         alert(error.error);
         console.log(error)
       }

     )

    

  }
*/








