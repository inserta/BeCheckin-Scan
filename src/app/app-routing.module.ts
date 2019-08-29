import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'filtros', loadChildren: './pages/filtros/filtros.module#FiltrosPageModule' },
  { path: 'bienvenida', loadChildren: './pages/bienvenida/bienvenida.module#BienvenidaPageModule' },
  { path: 'reserva/:idReserva', loadChildren: './pages/reserva/reserva.module#ReservaPageModule' },
  { path: 'nuevo-huesped', loadChildren: './pages/fastcheckin/nuevo-huesped/nuevo-huesped.module#NuevoHuespedPageModule' },
  { path: 'reserva/:idReserva/huesped/:idHuesped', loadChildren: './pages/huesped/huesped.module#HuespedPageModule' },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
