import { DEFAULT_ECDH_CURVE } from 'tls';
import { rootType } from './rootType';
import { demographicType } from './demographicType';
import { booleanType } from './booleanType';
import { dictionaryType } from './dictionaryType';
import { enumMultiType } from './enumMultiType';
import { enumType } from './enumType';
import { IMetadataNode } from './IMetadataNode';
import { listType } from './listType';
import { numberType } from './numberType';
import { objectBaseType } from './objectBaseType';
import { objectType } from './objectType';
import { stringType } from './stringType';
import { typelessType } from './typelessType';

export abstract class objectInitializer {
    public static createInstance(metadata:any,path:string[],pathString:string,node:any):objectBaseType{
        let type = metadata ? metadata.type : null;
        let mainType = type;

        if(mainType && mainType.includes('<')){
            mainType = type.substring(0,type.indexOf('<'))
        }
        
        let subType = type ? type.substring(type.indexOf('<')+1, type.indexOf('>')) : null;
        
        switch(mainType){
            case "String":
                return new stringType(node,metadata,path,pathString); 
            case "Boolean":
                return new booleanType(node,metadata,path,pathString);
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
                return new numberType(node,metadata,path,pathString);
            case "Enum":
                return new enumType(node,metadata,path,pathString);
            case "EnumMulti":
                return new enumMultiType(node,metadata,path,pathString);
            case "Object":
                return new objectType(node,metadata,path,pathString);
            case "List":
                return new listType(type,subType,node,metadata,path,pathString);
            case "Dictionary":
                return new dictionaryType(type,subType,node,metadata,path,pathString);
            case "root":
                return new rootType(node,metadata,path,pathString);
            case "Demographic":
                return new demographicType(node,metadata,path,pathString);
            default:
                return new typelessType(node,metadata,path,pathString);
        }
    }
}