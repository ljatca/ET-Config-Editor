import { IMetadataNode } from './IMetadataNode';
import { objectBaseType } from "./objectBaseType";

export abstract class valueObjectBaseType extends objectBaseType {
    constructor(node:any,metadata:IMetadataNode,path:string[],pathString:string){
        super(node,metadata,path,pathString);
    }
}