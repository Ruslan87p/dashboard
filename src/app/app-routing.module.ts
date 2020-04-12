import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    // redirect to login page
    redirectTo: 'login',
    // tell to angular that absolute path for correct redirecting
    pathMatch: 'full'
  },
  {
    path: 'system',
    loadChildren: './system/system.module#SystemModule'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // lazy loading, loads all modules after main is loaded
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {

}
