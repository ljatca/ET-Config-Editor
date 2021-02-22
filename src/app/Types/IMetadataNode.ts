export interface IMetadataNode{
    name: string;
    description: string;
    type: string;
    values: string;
    default: string;
    actions: string[];
    subMetadata: IMetadataNode[];
}