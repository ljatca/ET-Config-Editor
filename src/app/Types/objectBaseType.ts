import { IMetadataNode } from './IMetadataNode';
import { DialogService } from 'src/app/services/dialog.service';
import { DataService } from 'src/app/services/data.service';

export abstract class objectBaseType {
    public name: string;
    public type: string;
    public originalType: string;
    public path: string[];
    public pathString : string;
    public metadata: IMetadataNode;
    public row: HTMLElement;
    public node: any;
    
    
    protected constructor(node:any,metadata:IMetadataNode,path:string[],pathString:string){
          if(node.field) {
            this.name = node.field;
          }else{
            this.name = node.index;
          }
          
          this.originalType = metadata ? metadata.type : null; 
          this.path = path;
          this.pathString = pathString;
          this.metadata = metadata;
          this.row = node.dom.tr;
          this.node = node;
    }

    /* this function is overwritten in differnt type.ts */
    render(data:JSON, dialogService:DialogService, dataService:DataService) : Promise<any>{
        return dialogService.addDemographic();
    }

}