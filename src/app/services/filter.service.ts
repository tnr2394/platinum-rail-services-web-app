import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  filter(searchText,items,searchKeys){
    console.log({searchText,items,searchKeys})
    const filteredData = items.filter( (item) => {
      for (var i = 0; i < searchKeys.length;i++) {
        var key = searchKeys[i];
          if (item[key].toLowerCase().includes(searchText.toLowerCase())) {
              return true;
          }
      }
      return false;
  });
  return filteredData;

  }

}
