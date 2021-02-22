import { Injectable } from '@angular/core';
import { Dictionary } from 'lodash';
import { IMetadataNode } from '../Types/IMetadataNode';
import { objectBaseType } from '../Types/objectBaseType';
import { objectInitializer } from '../Types/objectInitializer';
import { MetadataService } from './metadata.service';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private tableData: Dictionary<objectBaseType> = {};
  private metadata: IMetadataNode;

  constructor(private metadataService: MetadataService) { 
    this.metadata = this.metadataService.getMetadata();
  }

  getTableData(node): Dictionary<objectBaseType> {
    this.getTableRowData(node ,null, "", true);
    return this.tableData;
  }

  getRowAtPath(path: string) {
    return this.tableData[path];
  }

  deletePath(path) {
    let regex = new RegExp("^" + path + "([a-z]|[A-Z]|[0-9]|.|,)*$");
    for(let [key,value] of Object.entries(this.tableData)) {
      if(regex.test(key)) {
        delete this.tableData[key];
      }
    }
  }

  getTypeInfo(type: string) {
    let typeObj = {
      editorType: null,
      keyType: null,
      valueType: null
    }
    let typeArr = type.split("<");
    if(typeArr[0] == "Dictionary") {
      let tmp = typeArr[1].split(",");
      typeObj.editorType = typeArr[0];
      typeObj.keyType = tmp[0];
      typeObj.valueType = tmp[1].replace(">", "");
    }else if(typeArr[0] == "List"){
      typeObj.editorType = "List";
      typeObj.valueType = type.slice(5, type.length - 1);
    }else{
      typeObj.editorType = type;
    }

    return typeObj;
  }

  private getTableRowData(node: any, path: string[], pathString: string, isRoot: boolean){
    if(isRoot) {
      path = [];
    } else {
      if(pathString != "")  {
        pathString += ".";
      }
      if(node.field) {
        pathString += node.field;
        path.push(node.field);
      }else{
        pathString += node.index;
        path.push(node.index + "");
      }
    }
   
    if(!this.tableData[pathString]) {
      let metadata = this.metadataService.getMetadataAtPath(this.metadata, path, 1);
      this.tableData[pathString] = objectInitializer.createInstance(metadata,path,pathString,node);

      $(node.dom.tr).data("path", pathString);
    }

    if(node.childs && node.childs.length > 0){
      for(let child of node.childs){
        this.getTableRowData(child, path, pathString, false);
      }    
    }

    path.pop();
  }
}
