export class FilterEventModel {
    columnName?: string;
    propertyName?: string;
    operator?: string;
    value?: string | number | boolean | Date | undefined;
    operation?: string;
    columns?: string;
}