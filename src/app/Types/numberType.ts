import { IMetadataNode } from './IMetadataNode';
import { valueObjectBaseType } from "./valueObjectBaseType";

export class numberType extends valueObjectBaseType {
    constructor(node:any,metadata:any,path:string[],pathString:string){
        super(node,metadata,path,pathString);
        this.type = "number";
    }
}