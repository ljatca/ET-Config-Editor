import { collectionBaseType } from "./collectionBaseType";
import { IMetadataNode } from './IMetadataNode';
import { objectBaseType } from './objectBaseType';

export class dictionaryType extends collectionBaseType {
    public keyType:string;
    public keyObject:objectBaseType;
    public valueType:string;
    public valueObject:objectBaseType;
    

    constructor(type:string,subType:string,node:any,metadata:any,path:string[],pathString:string){
        super(node,metadata,path,pathString);
        this.type = "dictionary";

        //TODO:A Parse subtype and create appropriate objects for sub types
    }
}