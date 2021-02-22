import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';


@Component({
  templateUrl: './enum-multi.component.html',
  styleUrls: ['./enum-multi.component.css']
})
export class EnumMultiComponent implements OnInit {

  enumOptions: string[];
  enumObj: any[] = [];
  enumStr: string = "";

  constructor(
    public dialogRef: MatDialogRef<EnumMultiComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.enumOptions = this.data;
    for(let option of this.enumOptions) {
      this.enumObj.push({
        name: option,
        value: option,
        checked: false
      });
    }
  }

  addEnumMulti() {
    for(let i = 0; i < this.enumObj.length; i++) {
      if(this.enumObj[i].checked) {
        this.enumStr += this.enumObj[i].name;
        this.enumStr += ',';
      }
    }
    this.enumStr = this.enumStr.substring(0, this.enumStr.length - 1);
    this.dialogRef.close({enumStr: this.enumStr});
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
