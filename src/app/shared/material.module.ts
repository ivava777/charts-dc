import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [MatToolbarModule, MatSelectModule, MatListModule, MatButtonModule],
  exports: [MatToolbarModule, MatSelectModule, MatListModule, MatButtonModule]
})
export class MaterialModule {}
