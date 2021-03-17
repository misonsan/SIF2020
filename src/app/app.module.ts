import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// services
import { AuthService } from './services/auth.service';
import { CommandaService } from './services/commanda.service';
import { CommandawService } from './services/commandaw.service';
import { CommandawrigaService } from './services/commandawriga.service';
import { GiornataService } from './services/giornata.service';
import { ManifestazioneService } from './services/manifestazione.service';
import { MoneywService } from './services/moneyw.service';
import { RouteGuardService } from './services/route-guard.service';
import { PersonaService }  from './services/persona.service';
import { ProdottoService }  from './services/prodotto.service';
import { TruolodayService }  from './services/truoloday.service';
import { TtipologiaService }  from './services/ttipologia.service';
import { MoneypaymentService }  from './services/moneypayment.service';
import { MoneypayService }  from './services/moneypay.service';
import { TabellaTService }  from './services/tabella-t.service';

// di sistema
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// utility
import {NgxPaginationModule} from 'ngx-pagination';   // paginazione
// per gestione messaggio esito operazione tipo popup a tempo
import { NotifierModule, NotifierOptions } from 'angular-notifier';
// per aprire una seconda popup dentro alla prima  (conferma Cancellazione)
import { ModalModule } from 'ngx-bootstrap/modal'; 

import { AppComponent } from './app.component';
// componenti utente
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { LoginnewComponent } from './components/loginnew/loginnew.component';
import { ManifestazioneComponent } from './components/manifestazione/manifestazione.component';
import { ManifestazioniComponent } from './components/manifestazioni/manifestazioni.component';
import { ManifestazioneDetailComponent } from './components/manifestazione-detail/manifestazione-detail.component';
import { ManifestazioneDataComponent } from './components/manifestazione-data/manifestazione-data.component';
import { GiornataComponent } from './components/giornata/giornata.component';
import { GiornataDataComponent } from './components/giornata-data/giornata-data.component';
import { GiornataDetailComponent } from './components/giornata-detail/giornata-detail.component';
import { GiornataDetailCassaComponent } from './components/giornata-detail-cassa/giornata-detail-cassa.component';
import { GiornataDetailPersoneComponent } from './components/giornata-detail-persone/giornata-detail-persone.component';
import { GiornataDetailProdottiComponent } from './components/giornata-detail-prodotti/giornata-detail-prodotti.component';
import { GiornataDetailListinoComponent } from './components/giornata-detail-listino/giornata-detail-listino.component';
import { RegistrazioneComponent } from './components/registrazione/registrazione.component';
import { PersonaComponent } from './components/persona/persona.component';
import { PersoneComponent } from './components/persone/persone.component';
import { PersonaDetailComponent } from './components/persona-detail/persona-detail.component';
import { ProdottiComponent } from './components/prodotti/prodotti.component';
import { ProdottoComponent } from './components/prodotto/prodotto.component';
import { ProdottoDetailComponent } from './components/prodotto-detail/prodotto-detail.component';
import { Prodotto2Component } from './components/prodotto2/prodotto2.component';
import { CommandaDetailComponent } from './components/commanda-detail/commanda-detail.component';
import { CommandaComponent } from './components/commanda/commanda.component';
import { CommandawDetailComponent } from './components/commandaw-detail/commandaw-detail.component';
import { Commandaw1DetailComponent } from './components/commandaw1-detail/commandaw1-detail.component';
import { Prodotti1Component } from './components/prodotti1/prodotti1.component';
import { Prodotto1Component } from './components/prodotto1/prodotto1.component';
import { Prodotto1DetailComponent } from './components/prodotto1-detail/prodotto1-detail.component';
import { CommandawrigheComponent } from './components/commandawrighe/commandawrighe.component';
import { CommandawrigaComponent } from './components/commandawriga/commandawriga.component';
import { HomeComponent } from './components/home/home.component';
import { Commandaw2DetailComponent } from './components/commandaw2-detail/commandaw2-detail.component';
import { PreviewCommandaComponent } from './components/preview-commanda/preview-commanda.component';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CommandaDataComponent } from './components/commanda-data/commanda-data.component';
import { CommandarigaComponent } from './components/commandariga/commandariga.component';
import { MoneypayComponent } from './components/moneypay/moneypay.component';
import { GestioneCommandeComponent } from './components/gestione-commande/gestione-commande.component';
import { Commanda1Component } from './components/commanda1/commanda1.component';
import { Commandariga1Component } from './components/commandariga1/commandariga1.component';
import { Prodotto3Component } from './components/prodotto3/prodotto3.component';
import { CommandarigalavComponent } from './components/commandarigalav/commandarigalav.component';
import { CommandarigaconComponent } from './components/commandarigacon/commandarigacon.component';
import { GestioneComandetestComponent } from './components/gestione-comandetest/gestione-comandetest.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProdottojobComponent } from './components/popups/prodottojob/prodottojob.component';
import { ManifestazionepopComponent } from './components/popups/manifestazionepop/manifestazionepop.component';
import { GiornatapopComponent } from './components/popups/giornatapop/giornatapop.component';
import { PersonadaypopComponent } from './components/popups/personadaypop/personadaypop.component';
import { ProdottodaypopComponent } from './components/popups/prodottodaypop/prodottodaypop.component';
import { CassapopComponent } from './components/popups/cassapop/cassapop.component';
import { TabelleComponent } from './components/tabelle/tabelle.component';
import { TabellaTwDettComponent } from './components/tabella-tw-dett/tabella-tw-dett.component';
import { ProdottiAnagComponent } from './components/prodotti-anag/prodotti-anag.component';
import { ProdottoAnagComponent } from './components/prodotto-anag/prodotto-anag.component';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 90,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 8000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    LoginnewComponent,
    ManifestazioneComponent,
    ManifestazioniComponent,
    ManifestazioneDetailComponent,
    ManifestazioneDataComponent,
    GiornataComponent,
    GiornataDataComponent,
    GiornataDetailComponent,
    GiornataDetailCassaComponent,
    GiornataDetailPersoneComponent,
    GiornataDetailProdottiComponent,
    GiornataDetailListinoComponent,
    RegistrazioneComponent,
    PersonaComponent,
    PersoneComponent,
    PersonaDetailComponent,
    ProdottiComponent,
    ProdottoComponent,
    ProdottoDetailComponent,
    Prodotto2Component,
    CommandaDetailComponent,
    CommandaComponent,
    CommandawDetailComponent,
    Commandaw1DetailComponent,
    Prodotti1Component,
    Prodotto1Component,
    Prodotto1DetailComponent,
    CommandawrigheComponent,
    CommandawrigaComponent,
    HomeComponent,
    Commandaw2DetailComponent,
    PreviewCommandaComponent,
    CommandaDataComponent,
    CommandarigaComponent,
    MoneypayComponent,
    GestioneCommandeComponent,
    Commanda1Component,
    Commandariga1Component,
    Prodotto3Component,
    CommandarigalavComponent,
    CommandarigaconComponent,
    GestioneComandetestComponent,
    ProdottojobComponent,
    ManifestazionepopComponent,
    GiornatapopComponent,
    PersonadaypopComponent,
    ProdottodaypopComponent,
    CassapopComponent,
    TabelleComponent,
    TabellaTwDettComponent,
    ProdottiAnagComponent,
    ProdottoAnagComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgbModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [AuthService, ManifestazioneService, GiornataService, RouteGuardService, AuthService, CommandaService,PersonaService,CommandawService,CommandawrigaService,
             ProdottoService,TruolodayService,TtipologiaService,MoneywService,MoneypaymentService, MoneypayService, TabellaTService
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
