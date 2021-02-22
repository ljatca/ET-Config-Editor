import { IMetadataNode } from './IMetadataNode';
import { objectBaseType } from "./objectBaseType";

export class typelessType extends objectBaseType {
    constructor(node:any,metadata:any,path:string[],pathString:string){
        super(node,metadata,path,pathString);
    } 
}