import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// componenti utente
import { LoginComponent } from './../app/components/login/login.component';
import { LoginnewComponent } from './../app/components/loginnew/loginnew.component';
import { ManifestazioniComponent } from './../app/components/manifestazioni/manifestazioni.component';
import { ManifestazioneDetailComponent } from './../app/components/manifestazione-detail/manifestazione-detail.component';
import { RegistrazioneComponent } from './../app/components/registrazione/registrazione.component';

import { Manifestazione } from './classes/Manifestazione';
import { ManifestazioneDataComponent } from './components/manifestazione-data/manifestazione-data.component';
import { GiornataDataComponent } from './components/giornata-data/giornata-data.component';
import { GiornataDetailCassaComponent } from './components/giornata-detail-cassa/giornata-detail-cassa.component';
import { GiornataDetailPersoneComponent } from './components/giornata-detail-persone/giornata-detail-persone.component';
import { GiornataDetailProdottiComponent } from './components/giornata-detail-prodotti/giornata-detail-prodotti.component';
import { GiornataDetailListinoComponent } from './components/giornata-detail-listino/giornata-detail-listino.component';
import { CommandaDetailComponent } from './components/commanda-detail/commanda-detail.component';
import { PersonaDetailComponent } from './components/persona-detail/persona-detail.component';
import { RouteGuardService } from './services/route-guard.service';
import { CommandawDetailComponent } from './components/commandaw-detail/commandaw-detail.component';
import { Commandaw1DetailComponent } from './components/commandaw1-detail/commandaw1-detail.component';
import { Commandaw2DetailComponent } from './components/commandaw2-detail/commandaw2-detail.component';
import { HomeComponent } from './components/home/home.component';
import { PreviewCommandaComponent } from './components/preview-commanda/preview-commanda.component';
import { CommandaDataComponent } from './components/commanda-data/commanda-data.component';
import { GestioneCommandeComponent } from './components/gestione-commande/gestione-commande.component';
// test
import { GestioneComandetestComponent } from './components/gestione-comandetest/gestione-comandetest.component';


// inserire ,   canActivate: [RouteGuardService]  quando sistemato problema registrazione
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: RegistrazioneComponent
  },
  {
    path: 'loginnew',
    component: LoginnewComponent
  },
  {
    path: 'manif',
    component: ManifestazioniComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'manif/new',
    component: ManifestazioneDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'manif/:id',
    component: ManifestazioneDataComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'gestione/:id',
    component: GestioneCommandeComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'gestionetest/:id',
    component: GestioneComandetestComponent,
    canActivate: [RouteGuardService]
  },






  {
    path: 'giormanif/:id',
    component: GiornataDataComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'giormanifcassa/:id',
    component: GiornataDetailCassaComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'giormanifpersone/:id',
    component: GiornataDetailPersoneComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'giormanifprodotti/:id',
    component: GiornataDetailProdottiComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'giormaniflistino/:id',
    component: GiornataDetailListinoComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'commandeGiornata/:id',
    component: CommandaDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'commandaw/:id/new',
    component: CommandawDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'commanda/:id/show',
    component: CommandaDataComponent,
    canActivate: [RouteGuardService]
  },




  {
    path: 'commandaw1/:id',
    component: Commandaw1DetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'commandaw2/:id',
    component: Commandaw2DetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'prewcommanda/:id',
    component: PreviewCommandaComponent,
   // canActivate: [RouteGuardService]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RouteGuardService]
  },
/*
  {

  },
  {
    path: '',
    redirectTo: 'manif',
    pathMatch: 'full'
  },
*/

 /*
  {
    path: 'users/new',
    component: UserDetailComponent
  },
  {
    path: 'users/:id/edit',
    component: UserDetailComponent
  },
  {
    path: 'users/:id',
    component: UserDataComponent
  } */
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
