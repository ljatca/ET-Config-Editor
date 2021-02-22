import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  templateUrl: './enum-multi-inline.component.html',
  styleUrls: ['./enum-multi-inline.component.css']
})
export class EnumMultiInlineComponent {

  @Input() options: string[] = [];
  @Input() selectedList: string[] = [];

  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor() { }

  modelChange($event) {
    let value = this.selectedList.join(",");
    this.change.emit(value);
  }

}
