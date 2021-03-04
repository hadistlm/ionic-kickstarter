import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
	public version="V 0.0.1";

	public _user={
    authToken:"",
    id_users:"",
    id_role:"",
    id_vendor:"",
    data:{},
  };

  constructor(
  	public router:Router
  ) { }

  _generateID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  _isJson(json_string){
    json_string = typeof json_string !== "string"
        ? JSON.stringify(json_string)
        : json_string;

    try {
        json_string = JSON.parse(json_string);
    } catch (e) {
        return false;
    }

    if (typeof json_string === "object" && json_string !== null) {
        return true;
    }

    return false;
  }

  _ucFirst(string) {
    return (string) ? string[0].toUpperCase() + string.slice(1) : '';
  }

  openPage(location,param:any = {}){
    let navigationExtras: NavigationExtras= {
      queryParams: {
        special: JSON.stringify(param)
      }
    };

    this.router.navigate([location], navigationExtras);
  }

  countObject(data:object = {}){
    return (data) ? Object.keys(data).length : 0;
  }

  sumArrayMulti(data:any){
    const holder = Object.keys(data).map(function(key, index) {
      return data.length
    });

    return holder.reduce(function (a, b) { return a + b; }, 0);
  }

  searchArray(key,nameKey, myArray){
    for (let i=0; i < myArray.length; i++) {
      if (myArray[i][key] === nameKey) {
          return i;
      }
    }
    return -1;
  }

  existArray(nameKey, myArray){
    for (let i=0; i < myArray.length; i++) {
      if (myArray[i] === nameKey) {
          return true;
      }
    }
    return false;
  }

  am_pm(date){
    if(date.getHours()==0 && date.getMinutes()==0 && date.getSeconds()==0)
      return ''; // No AM for MidNight
    if(date.getHours()==12 && date.getMinutes()==0 && date.getSeconds()==0)
      return ''; // No PM for Noon
    if(date.getHours()<12)
      return ' AM';
    return ' PM';
  }

  dateConvert(date:string, format:string = 'YYYY-MM-DD HH-mm-ss'){
    return moment(date).format(format);
  }

  dateIsEqual(date:string, type:any = 'day'){
    return moment().isSame(date, type);
  }

  getToday(format:string = 'YYYY-MM-D'){
    return moment().format(format);
  }

  getPastDay(numberOfDay:number = 1, format:string = 'YYYY-MM-D') {
    return moment().subtract(numberOfDay, 'day').format(format);
  }

  date_format(date){
    let result=this.setZero(date.getDate())+'/'+this.setZero(date.getMonth()+1)+'/'+(date.getFullYear()+' ').substring(2)+this.setZero(this.hours(date))+':'+this.setZero(date.getMinutes())+this.am_pm(date);
    return result;
  }
}
