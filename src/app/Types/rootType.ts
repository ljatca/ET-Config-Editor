import { IMetadataNode } from './IMetadataNode';
import { referenceObjectBaseType } from "./referenceObjectBaseType";
import { DialogService } from 'src/app/services/dialog.service';
import * as _ from 'lodash';

export class rootType extends referenceObjectBaseType {

    constructor(node:any,metadata:IMetadataNode,path:string[],pathString:string){
        super(node,metadata,path,pathString);
        this.type = "root";
    }

    render(data:JSON, dialogService:DialogService): Promise<any>{
        let promise = dialogService.addDemographic();
        return promise.then((result) => {
            if(result != undefined) {
                let path = [];
                path.push(result.demStr);
                if(_.get(data, path, null) == null) {
                    data[result.demStr] = {};
                }
                return data;
            }
        });
    }
}