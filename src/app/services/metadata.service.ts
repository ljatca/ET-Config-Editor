import { Injectable } from '@angular/core';
import json from '../../assets/meta.json';
import nodeMeta from '../../assets/metadata.json';
import * as _ from 'lodash';
import { IMetadataNode } from '../Types/IMetadataNode';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor() { }

  getDemographicMetadata() { 
    return json;
  }

  getMetadata():IMetadataNode { 
    return nodeMeta;
  }

  getMetadataAtPath(metadata: IMetadataNode, path: string[], index: number):IMetadataNode {
    let node: IMetadataNode = null;

    //Return root node meta
    if(path.length == 0) {
      return metadata;
    }
    //Return Demographic Meta
    else if(path.length == 1){
      return metadata.subMetadata[0];
    }
    //Set Page Meta
    else if(metadata.type == "Dictionary<EnumMulti,Object>" && metadata.values != "") {
      node = {
        name: "Page Object",
        description:"An Object for setting props",
        type:"Pages",
        values:"",
        default:"",
        actions: ["Remove", "Add", "Info"],
        subMetadata:  metadata.subMetadata
      };
    }
    else if(metadata.type.slice(0,4) == "List") {
      let typeVal = metadata.type.slice(5, metadata.type.length - 1);
      let actions = [ "RemoverArrItem" ];
      if(typeVal.slice(0,4) == "List") {
        actions.push("Add");
      }

      node = {
        name: "ListObj",
        description: null,
        type: typeVal,
        values:"",
        default:"",
        actions: actions,
        subMetadata:  metadata.subMetadata
      };
    }
    //Find next node in path
    else {
      if(index == 1) {
        metadata = metadata.subMetadata[0];
      }
    
      if(metadata.subMetadata) {
        for(let subNode of metadata.subMetadata) {
          if(subNode.name == path[index]) {
            node = subNode;
          }
        }
      }
    }

    //Return node if its last node in path
    if(node && index == path.length - 1) {
      return node;
    }
    //Find next node if the path length is greater than index
    else if(node && index < path.length - 1){
      return this.getMetadataAtPath(node, path, index + 1);
    }
    //Return null if there is no meta for node
    else{
      return null;
    } 
   
  }

}
