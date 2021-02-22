import { enumType } from "./enumType";
import { IMetadataNode } from './IMetadataNode';

export class enumMultiType extends enumType {
    constructor(node:any,metadata:any,path:string[],pathString:string){
        super(node,metadata,path,pathString);
        this.type = "enummulti";
    }
}