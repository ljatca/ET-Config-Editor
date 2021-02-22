import { Component, ViewChild, Input, AfterViewInit, Inject, Injector } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';


import uiconfig from '../../../assets/UIConfig.json';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/common';
import { DialogService } from 'src/app/services/dialog.service';
import { createCustomElement, NgElement, WithProperties } from '@angular/elements';
import { EnumMultiInlineComponent } from 'src/app/inline-editors/enum-multi-inline/enum-multi-inline.component';
import { DataService } from 'src/app/services/data.service';
import { Dictionary } from 'lodash';
import { objectBaseType } from 'src/app/Types/objectBaseType';
import { IMetadataNode } from 'src/app/Types/IMetadataNode';

@Component({
  selector: 'app-editor',
  template: '<json-editor [data]="data" #editor>',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {

  private tableData: Dictionary<objectBaseType>;
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  @Input() data: any;

  constructor(private dataService: DataService, private dialogService: DialogService ,
    @Inject(DOCUMENT) private document: Document, private injector: Injector) {

    this.data = uiconfig;

    //Declaration for custom dynamic elements
    const EnumMultiElement = createCustomElement(EnumMultiInlineComponent, {injector});
    customElements.define('enum-multi', EnumMultiElement);
  }
 
  ngAfterViewInit(): void {
    this.editor.setOptions(this.getEditorOptions());
    this.editor.expandAll();
    this.handleTableRows();
    this.editor.collapseAll();

    $('body').on('click', "button.jsoneditor-collapsed, button.jsoneditor-expanded", () => {
      this.handleTableRows();
    });

    //Hacky solution, need to find how to remove the mousedown eventlistener instead
    $('div.jsoneditor').on('mousedown', 'input,select', function() {
      this.focus();
    });
    
    // EnumMulti Inline Editor (Remove from here and insert into the editor table where needed)
    let select: NgElement & WithProperties<EnumMultiInlineComponent> = this.document.createElement("enum-multi") as any;
    select.options = ["Test1", "Test2", "Test3", "Test4"];
    select.selectedList = ["Test1", "Test2"];
    select.addEventListener('change', (e) => {
      console.log((<any>e).detail);
    });
    $('app-editor').parent().parent().append(select);

  }

  private handleTableRows = () => {
    this.tableData = this.dataService.getTableData((<any>this.editor).editor.node)
    
    for(let [key,value] of Object.entries(this.tableData)) {
      let $row = $((<any> value).node.dom.tr);

      if(!$row[0]) {
        continue;
      }

      if(!(<any> value).node.dom.tr.formatted) {
        this.formatTableRow($row, value);
      }

      this.actionButtons(key, value);
    }

    $('tr.jsoneditor-append').each(function() {
      let $this = $(this);
      $this.find("button.jsoneditor-contextmenu-button").hide();
      if(this.children.length < 5  && this.firstChild) {
        $(this.firstChild.nextSibling).after("<td></td><td></td>");
      }
    });
    
  }

  private formatTableRow = ($row: JQuery<any>, rowData: objectBaseType) => {
    $row.find('div.jsoneditor-boolean').prop("contentEditable", false);
    $(rowData.node.dom.field).prop("contenteditable", false);

    //Number Values
    let number = $row.find('div.jsoneditor-number');
    if(number.length != 0){
      
      let numIn = this.document.createElement("input");
      numIn.value = "0";
      numIn.setAttribute("type", "number");

      number.parent().append(numIn);

      $(number).on("keydown", function(event) {
        if((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 8 || event.keyCode == 37 
        || event.keyCode == 39 || event.keyCode == 189 || event.keyCode == 190){
          return true;
        }else{
          return false;
        }
      });
    }

    if(rowData.metadata && rowData.metadata.type == "EnumMulti") {
      // Add EnumMulti Inline Editor to row and hide current contenteditable div
    }    

    let menuBtn = $row.find('button.jsoneditor-contextmenu-button');
    menuBtn.parent().remove();
    $('table colgroup col').remove();
    $('table colgroup').prepend('<col width="24px">');
    
    this.createButtonBox($row, "removeButtonBox");
    this.createButtonBox($row, "addButtonBox");
    this.createButtonBox($row, "infoButtonBox");

    $row.prop("formatted", true);
  }

  private actionButtons = (path: string, rowData: objectBaseType) => {
    if(rowData.metadata) {
      let actions = rowData.metadata.actions;
      for(let action of actions) {
        switch(action) {
          case "Remove":
            this.addRemoveButton(rowData, this.removeNode);
            break;
          case "Add":
            this.addAddButton(rowData, path);
            break;
          case "Info":
            this.addInfoButton(rowData);
            break;
          case "RemoverArrItem":
            this.addRemoveButton(rowData, this.removeArrayItem);
            break;
        }
      }
    }
  }

  private doAction = (metadata: IMetadataNode, path: string) => {
    let typeObj = this.dataService.getTypeInfo(metadata.type);
    let data = this.editor.get();
    let promise = this.tableData[path].render(data, this.dialogService, this.dataService);

    promise.then((result) => {
      if(result != undefined){
         
          this.updateData(result);
      }
    });

    if(typeObj.editorType == "root") {
      // let promise = this.dialogService.addDemographic();
      // promise.then((result) => {
      //   if(result != undefined) {
      //     let data = this.editor.get();
      //     let path = [];
      //     path.push(result.demStr);
      //     if(_.get(data, path, null) == null) {
      //       data[result.demStr] = {};
      //     }
      //     this.updateData(data);
      //   }
      // });
    }else if(typeObj.editorType == "Dictionary" && typeObj.keyType == "EnumMulti") {
      if(metadata.values) {
        let promise = this.dialogService.getEnumMulti(metadata.values.split(","));
        promise.then((result) => {
          if(result) {
            let data = this.editor.get();
            path += "." + result.enumStr;
            if(!_.has(data, path)) {
              _.set(data, path, {});
              this.updateData(data);
            }
          }
        });
      }
    }else if(typeObj.editorType == "Dictionary" || typeObj.editorType == "Pages") {

      if(metadata.subMetadata && metadata.subMetadata.length > 0) {
        let options = [];
        for(let option of metadata.subMetadata) {
          options.push(option.name);
        }
        let promise = this.dialogService.addConfiguration(options);
        promise.then((result) => {
          if(result) {
            let data = this.editor.get();
            path += "." + result.key;
            if(!_.has(data, path)) {
              let newMetadata: IMetadataNode = null;
              for(let subMetadata of metadata.subMetadata) {
                if(subMetadata.name == result.key) {
                  newMetadata = subMetadata;
                  break;
                }
              }

              let value = null;
              let typeObj2 = this.dataService.getTypeInfo(newMetadata.type);
              if(typeObj2.editorType == 'String'){
                value = "";
              }else if(typeObj2.editorType == 'Integer' || typeObj2.editorType == "Decimal") {
                value = 0;
              }else if(typeObj2.editorType == "Boolean") {
                value = true;
              }else if(typeObj2.editorType == 'Dictionary' || typeObj2.editorType == "Object") {
                value = {};
              }else if(typeObj2.editorType == "List"){
                value = [];
              }

              _.set(data, path, value);
              this.updateData(data);
            }
          }
        });
      }
    }else if(typeObj.editorType == "List") {
      let typeObj2 = this.dataService.getTypeInfo(typeObj.valueType);
      if(typeObj2.editorType == "List") {
        let data = this.editor.get();
        let currVal = _.get(data, path);
        currVal.push([]);
        _.set(data, path, currVal);
        this.updateData(data);
      }else if(typeObj2.editorType == "String") {
        let data = this.editor.get();
        let currVal = _.get(data, path);
        currVal.push("");
        _.set(data, path, currVal);
        this.updateData(data);
      }else if(typeObj2.editorType == "Integer") {
        let data = this.editor.get();
        let currVal = _.get(data, path);
        currVal.push(0);
        _.set(data, path, currVal);
        this.updateData(data);
      }
    }
  }

  private updateData = (data: any) => {
    this.editor.update(data);
    this.handleTableRows();
  }

  private removeNode = (path: string) => {
    let data = this.editor.get();
    _.unset(data, path);
    this.dataService.deletePath(path);
    this.updateData(data);
  }

  private removeArrayItem = (path: string) => {
    let data = this.editor.get();
    let arrPath = path.split(".");
    let removeIndex = arrPath.pop();
    let arr = _.get(data, arrPath);
    _.pullAt(arr, [parseInt(removeIndex)])
    _.set(data, arrPath, arr);
    this.dataService.deletePath(path);
    this.updateData(data);
  }

   private getEditorOptions = () => {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.name = "UIConfig"; // Change to filename when multifile editing
    this.editorOptions.mode = 'tree';
    this.editorOptions.enableTransform = false;
    this.editorOptions.enableSort = false;
    (<any>this.editorOptions).limitDragging = true;
    this.editorOptions.onChange = () => {
      this.handleTableRows();
    };
    return this.editorOptions;
  }

  addInfoButton = (rowData: objectBaseType) => {
    let val = <any> rowData;
    let button = this.document.createElement("button");
    button.setAttribute("class", "editorbutton tooltip infoButton");
    let icon = this.document.createElement("i");
    icon.setAttribute("class", "material-icons md-18");
    icon.innerText = "info";
    button.appendChild(icon);
    let hasBtn = $(val.node.dom.tr).find(".infoButton");
    if(val.metadata.description != "" && hasBtn.length == 0) {
      let tooltip = this.document.createElement("span");
      tooltip.setAttribute("class", "tooltiptext");
      tooltip.toggleAttribute("hidden");
      let type = val.metadata.type.replace(/</g, "&lt");
      type = type.replace(/>/g, "&gt");
      tooltip.innerHTML = "<b>" + val.metadata.name + "</b><br>Type: <i style='padding-left:5px'>" + type + "</i><br><br>" + val.metadata.description;
      button.onclick = () => {
        tooltip.toggleAttribute("hidden");
        button.focus();
      };
      button.onblur = () => {
        tooltip.toggleAttribute("hidden", true);
      }
      button.appendChild(tooltip);
      $(val.node.dom.tr).find(".infoButtonBox")[0].appendChild(button);
    }
  }

  addRemoveButton = (rowData: objectBaseType, removeFunc: (path: string) => void) => {
    let val = <any> rowData;
    let hasBtn = $(val.node.dom.tr).find(".removeButton");
    if(hasBtn.length == 0) {
      let button = this.document.createElement("button");
      $(button).addClass("editorbutton removeButton")
      let icon = this.document.createElement("i");
      icon.setAttribute("class", "material-icons md-18");
      icon.innerText = "disabled_by_default";
      icon.style.color = "red";
      button.appendChild(icon);
      icon.onclick = () => {
        removeFunc(val.pathString);
      }
      $(val.node.dom.tr).find(".removeButtonBox")[0].appendChild(button);
    }
  }

  addAddButton = (rowData: objectBaseType, path: string) => {
    let val = <any> rowData;
    let hasBtn = $(val.node.dom.tr).find(".addButton");
    if(hasBtn.length == 0) {
      let button = this.document.createElement("button");
      $(button).addClass("editorbutton addButton")
      let icon = this.document.createElement("i");
      icon.setAttribute("class", "material-icons md-18");
      icon.innerText = "add_box";
      icon.style.color = "grey";
      button.appendChild(icon);
      icon.onclick = () => {
        this.doAction(val.metadata, path);
      };
      $(val.node.dom.tr).find(".addButtonBox")[0].appendChild(button);
    }
  }

  private createButtonBox = ($row: JQuery<any>, className: string) => {
    let td = this.document.createElement("td");
    td.setAttribute("class", className);
    let ref2 = $row.find("table.jsoneditor-values").parent();
    $('table colgroup').prepend('<col width="24px"');
    $(td).insertBefore(ref2);    
  }
}