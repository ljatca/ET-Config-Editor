import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnumMultiComponent } from '../components/enum-multi/enum-multi.component';
import { DemographicComponent } from '../components/demographic/demographic.component';
import { ConfigurationComponent } from '../components/configuration/configuration.component';
import { MetadataService } from './metadata.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private metadataService: MetadataService) { }

  private openModal(component, options, width, height) {
    const dialogRef = this.dialog.open(component, {
      width: width,
      height: height,
      data: options
    });

    return dialogRef;
  }

  async getEnumMulti(options: string[]) {
    const dialogRef = this.openModal(EnumMultiComponent, options, "35%", "70%");
    let promise = await dialogRef.afterClosed().toPromise();
    return promise;
  }

  async addDemographic() {
    let options = this.metadataService.getDemographicMetadata();
    const dialogRef = this.openModal(DemographicComponent, options, "70%", "80%");
    let promise = await dialogRef.afterClosed().toPromise();
    return promise;
  }

  async addConfiguration(options: string[]) {
    const dialogRef = this.openModal(ConfigurationComponent, options, "30%", "45%");
    let promise = dialogRef.afterClosed().toPromise();
    return promise;
  }


}
