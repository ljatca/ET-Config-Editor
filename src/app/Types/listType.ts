import { collectionBaseType } from "./collectionBaseType";
import { IMetadataNode } from './IMetadataNode';
import { objectBaseType } from './objectBaseType';
import { booleanType } from './booleanType';
import { dictionaryType } from './dictionaryType';
import { enumMultiType } from './enumMultiType';
import { enumType } from './enumType';
import { numberType } from './numberType';
import { objectType } from './objectType';
import { stringType } from './stringType';
import { typelessType } from './typelessType';

export class listType extends collectionBaseType {
    public valueType:string;
    public valueObject:objectBaseType;

    constructor(type:string,subType:string,node:any,metadata:any,path:string[],pathString:string){
        super(node,metadata,path,pathString);
        this.type = "list";
        //TODO:A Parse subtype and create appropriate objects for sub type
        this.valueType = subType;
        switch(subType){
            case "String":
               this.valueObject = new stringType(node,metadata.subMetadata,path,pathString);
               break; 
            case "Boolean":
                this.valueObject = new booleanType(node,metadata.subMetadata,path,pathString);
                break;
            case "Byte":
            case "SByte":
            case "Short":
            case "UShort":
            case "Integer":
            case "UInteger":
            case "Long":
            case "ULong":
            case "Single":
            case "Double":
            case "Decimal":
            case "Int64":
            case "Int32":
            case "Int16":
            case "Float":
                this.valueObject = new numberType(node,metadata.subMetadata,path,pathString);
                break;
            case "Enum":
                this.valueObject = new enumType(node,metadata.subMetadata,path,pathString);
                break;
            case "EnumMulti":
                this.valueObject = new enumMultiType(node,metadata.subMetadata,path,pathString);
                break;
            case "Object":
                this.valueObject = new objectType(node,metadata.subMetadata,path,pathString);
                break;
            case "List":
                this.valueObject = new listType(type,subType,node,metadata.subMetadata,path,pathString);
                break;
            case "Dictionary":
                this.valueObject = new dictionaryType(type,subType,node,metadata.subMetadata,path,pathString);
                break;
            default:
                this.valueObject = new typelessType(node,metadata.subMetadata,path,pathString);
                break;
        }

    }
}