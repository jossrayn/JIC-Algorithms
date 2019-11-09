import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatIconModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FloydComponent } from './components/floyd/floyd.component';
import { MochilaComponent } from './components/mochila/mochila.component';
import { SeriesComponent } from './components/series/series.component';
import { ReemplazoComponent } from './components/reemplazo/reemplazo.component';
import { ArbolesComponent } from './components/arboles/arboles.component';
import { MatricesComponent } from './components/matrices/matrices.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule,MatExpansionModule, MatSelectModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatSliderModule} from '@angular/material/slider';
import {MatGridListModule} from '@angular/material/grid-list';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MainComponent,
    FloydComponent,
    MochilaComponent,
    SeriesComponent,
    ReemplazoComponent,
    ArbolesComponent,
    MatricesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatCardModule,
    MatSliderModule,
    MatGridListModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
