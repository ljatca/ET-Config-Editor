import { IMetadataNode } from './IMetadataNode';
import { objectBaseType } from "./objectBaseType";

export abstract class collectionBaseType extends objectBaseType {
    constructor(node:any,metadata:IMetadataNode,path:string[],pathString:string){
        super(node,metadata,path,pathString);
    }
}