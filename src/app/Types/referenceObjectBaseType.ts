import { IMetadataNode } from './IMetadataNode';
import { objectBaseType } from "./objectBaseType";

export abstract class referenceObjectBaseType extends objectBaseType {
    constructor(node:any,metadata:IMetadataNode,path:string[],pathString:string){
        super(node,metadata,path,pathString);
    }
    parseSubType(subType:string) : any{
        let value = null;

        switch(subType){
            case "String":
                return value = "";
            case "Boolean":
                return value = true;
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
                return value = 0;
            case "Enum":
            case "EnumMulti":
            case "Dictionary":
                return value = {};
            case "Object":
                return value = {};
            case "List":
                return value = [];
            default:
                return value = null;
        }
    }
}