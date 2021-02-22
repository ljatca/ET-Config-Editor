import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';


@Component({
  selector: 'app-demographic',
  templateUrl: './demographic.component.html',
  styleUrls: ['./demographic.component.css']
})
export class DemographicComponent implements OnInit {

  demographicsStr: string = "";
  rules = []; 

  json: any;
  comparisonOp: string = "--";
  arguments: string = "";
  value?: string;
  argType: string;

  constructor(public dialogRef: MatDialogRef<DemographicComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.json = [];
    for(let obj of this.data) {
      this.json.push(this.metadataNodeToTree(obj, ""));
    }
  }

  metadataNodeToTree(node, path): any {
    let treeNode: any = {};
    treeNode.title = node.name;
    if(path == "") {
      treeNode.key = node.name;
    }else{
      treeNode.key = path + "." + node.name;
    }
    treeNode.type = node.type;
    if(node.subMeta.length > 0) {
      treeNode.children = [];
      treeNode.isLeaf = false;
      for(let subNode of node.subMeta) {
        treeNode.children.push(this.metadataNodeToTree(subNode, treeNode.key));
      }
    }else{
      treeNode.isLeaf = true;
    }
    return treeNode;
  }

  onChange($event: any) {
    let node = this.findNode(this.json, $event);
    if(!node.isLeaf){
      return false;
    }

    if(node.type == "int") {
      this.argType = "number";
    }else{
      this.argType = node.type;
    }
  }


  findNode(data: any[], key: string): any {
    let node: any;
    let nodePath;
    let obj;
    let dataObj = data;

    if(key == null) {
      return null;
    }

    nodePath = key.split(".");

    for(let i = 0; i < nodePath.length; i++) {
      for(obj of dataObj) {
        if(obj.title == nodePath[i]) {
          dataObj = obj.children;
          break;
        }
      }
    }
    node = obj;
    return node;
  }

  addRule() {
    let ruleStr = "";
    ruleStr += this.value;
    ruleStr += this.comparisonOp;
    ruleStr += this.arguments;

    if(!this.rules.includes(ruleStr)) {
      this.rules.push(ruleStr);
    }

    if(this.demographicsStr != "") {
      this.demographicsStr += ";";
    }
    this.demographicsStr += ruleStr;
    this.comparisonOp = "--";
    this.arguments = "";
    this.value = null;
  }

  displayNode(node) {
    return node.key;
  }

  addDemographic() {
    this.dialogRef.close({demStr: this.demographicsStr});
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

