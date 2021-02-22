import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import _ from 'lodash';

@Component({
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  public selectedValue: string;

  constructor(
    public dialogRef: MatDialogRef<ConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.selectedValue = "Select a config...";
  }
  
  ngOnInit(): void {
    
  }

  addConfig() {
    this.dialogRef.close({key: this.selectedValue});
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
