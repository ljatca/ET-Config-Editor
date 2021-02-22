import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemographicComponent } from './components/demographic/demographic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { HttpClientModule } from '@angular/common/http';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { MatTreeModule } from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import { EditorComponent } from './components/editor/editor.component';
import { EnumMultiComponent } from './components/enum-multi/enum-multi.component';
import { EnumMultiInlineComponent } from './inline-editors/enum-multi-inline/enum-multi-inline.component';
import { NzSelectModule } from 'ng-zorro-antd/select';



registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    DemographicComponent,
    ConfigurationComponent,
    EditorComponent,
    EnumMultiComponent,
    EnumMultiInlineComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgJsonEditorModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    NzTreeSelectModule,
    NzSelectModule,
    MatTreeModule,
    MatIconModule
  ],
  entryComponents: [
    EnumMultiInlineComponent
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule {}
