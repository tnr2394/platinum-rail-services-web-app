import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(items: any, searchText: any): any {
    if (!searchText) {
      return items;
    }

    if (!items) {
      return [];
    }

    if (searchText && items) {
      let searchKeys = Object.keys(searchText);
      console.log("SEARCH KEY IS", searchText);
       {
        return items.filter(item => {
          return searchKeys.some((keyName) => {
            console.log("ITEMS ARE",items);
            return new RegExp(searchText[keyName], 'i').test(item[keyName]) || searchText[keyName] == "";
          });
        });
      }
    }
  }
}