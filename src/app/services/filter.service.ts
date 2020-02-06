import { Injectable } from '@angular/core';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  filter(searchText, items, searchKeys) {
    console.log({ searchText, items, searchKeys })
    const filteredData = items.filter((item) => {
      for (var i = 0; i < searchKeys.length; i++) {
        var key = searchKeys[i];
        console.log("item[key] ", item[key], " ******** " ,item[key].toString().toLowerCase())
        console.log("searchText", searchText, " ******** " , searchText.toString().toLowerCase())
        if (item[key].toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
          return true
        }
        else {
          return false;
        }
      }
    });
    return filteredData;
  }

}
