import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
    public nativeStorage:NativeStorage,
  	public router:Router
  ) { }

  _createSession(result) {
    if(result.token != undefined){
      localStorage.setItem('authToken',result.token);
      this._user.authToken=String(result.token);
    }
    
    this._user.id_users  = result.user_id;
    this._user.id_role   = result.role_id;
    this._user.id_vendor = result.vendor_id;
    this._user.data      = result;
    
    return this._createStorage("sessionIronman", this._user);
  }

  _destroySession(){
    return new Promise((resolve, reject) => {
      this.nativeStorage
        .clear()
        .then(data => {
          this._user={
            authToken:"",
            id_users:"",
            id_role:"",
            id_vendor:"",
            data:{},
          };
              
          localStorage.clear();
          resolve(true);  

        }, error => {
          reject(error)  
        });

    });
  }

  _createStorage(mystorage,myparam){
    let myNparam=window.btoa(JSON.stringify(myparam));
    myNparam=window.btoa(window.btoa(mystorage)+"_"+myNparam);

    return new Promise((resolve, reject) => {
      this.nativeStorage.setItem(mystorage, myNparam)
      .then(
        () =>resolve(true),
        error => reject(error)
      );
    });
  }

  _getAllUserInfo(storage){
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(storage)
      .then(
        data => {
          let decData=window.atob(data);
          let repDatastr=decData.replace(window.btoa(storage)+"_", "");
          decData=window.atob(repDatastr);
          let realData=JSON.parse(decData);
          this._setUser(realData);
          resolve(realData);
        },      
        error => {
          reject(error)
        }
      );  
    });
  }

  _setUser(result){
    if(result.authToken!=undefined) this._user.authToken=result.authToken;
    if(result.user_id!=undefined) this._user.id_users=result.id_users;
    if(result.vendor_id!=undefined) this._user.id_vendor=result.vendor_id;
    if(result.role_id!=undefined) this._user.id_role=result.role_id;
    if(result.data!=undefined) this._user.data=result.data;
   
   //console.log('myData User 12',this._user);
  }

  _isLoggedIn(){
    if(this._user.id_users!=undefined && this._user.id_users!='' && this._user.id_users!=null) return true;
    else false;    
  }

  _updateDataUser(sessionName,data){
     let newData=this._user;

     if(sessionName=='authToken') newData.authToken=data;
     else if(sessionName=='user_id') newData.id_users=data;
     else if(sessionName=='vendor_id') newData.id_vendor=data;
     else if(sessionName=='role_id') newData.id_role=data;  
     else if(sessionName=='data') newData.data=data;
     else {

     }

     this._createStorage("sessionIronman",newData);
  }

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

  setZero(number){
    return (number < 10 ? '0' : '') + number;
  }

  hours(date){
    var hours = date.getHours();
    if(hours > 12)
        return hours - 12; // Substract 12 hours when 13:00 and more
    return hours;
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
