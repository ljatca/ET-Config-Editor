import { IMetadataNode } from './IMetadataNode';
import { referenceObjectBaseType } from "./referenceObjectBaseType";
import { DialogService } from 'src/app/services/dialog.service';
import { DataService } from 'src/app/services/data.service';
import * as _ from 'lodash';

export class demographicType extends referenceObjectBaseType {

    constructor(node:any,metadata:IMetadataNode,path:string[],pathString:string){
        super(node,metadata,path,pathString);
        this.type = "Demographic";
    }

    render(data:JSON, dialogService:DialogService, dataService:DataService): Promise<any>{
        let newPath = this.pathString;
        if(this.metadata.subMetadata && this.metadata.subMetadata.length > 0) {
            let options = [];
            for(let option of this.metadata.subMetadata) {
                let obj = JSON.parse(JSON.stringify(data));
                options.push(option.name);

                /* filter out existing item */
                if( _.get(obj, newPath) && (option.name in _.get(obj, newPath)) )
                    options.pop();

            }
            let promise = dialogService.addConfiguration(options);
            return promise.then((result) => {
                if(result != undefined) {

                    newPath += "." + result.key;
                    if(!_.has(data, newPath)) {
    
                        /* new item to be added */
                        let newMetadata: IMetadataNode = null;

                        for(let subMetadata of this.metadata.subMetadata) {
                            if(subMetadata.name == result.key) {
                                newMetadata = subMetadata;
                                break;
                            }
                        }

                        /* no new item was chosen */
                        if(!newMetadata){
                            return data;
                        }
                        
                        let typeObj2 = dataService.getTypeInfo(newMetadata.type);
                        
                        _.set(data, newPath, this.parseSubType(typeObj2.editorType));
                    }

                    return data;
                }
            });
        }   
    }
}