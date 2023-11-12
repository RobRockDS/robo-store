import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './pages/tasks/tasks.component';
import { LayoutComponent } from './componets/layout/layout.component';
import { GridComponent } from './pages/grid/grid.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path:'',
        redirectTo:'grid',
        pathMatch:'full'
      },
      {
        path: 'grid',
        component: GridComponent,
      },
      {
        path: 'tasks',
        component: TasksComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule {}
