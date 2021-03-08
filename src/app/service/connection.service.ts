import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpParams } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/service/helper.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
	private url: string = environment.baseURL;
	private headers={
       'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
      ,'Accept':'application/json, text/plain'
      ,'Access-Control-Allow-Methods':'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      ,'Access-Control-Allow-Origin':'*'
      ,'Access-Control-Allow-Credentials':'true'
      ,'Authorization':((localStorage.getItem('authToken')) ? localStorage.getItem('authToken') : '')
      ,'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, "Authorization"'
  };

  constructor(
  	private baseHTTP: HttpClient,
  	private nativeHTTP: HTTP,
  	private transfer: FileTransfer,
  	public file:File,
  	public helper: HelperService,
    public platform: Platform
  ) { }

  get(endpoint: string, data?: any) {
  	if (localStorage.getItem('authToken')) {
      this.headers.Authorization=localStorage.getItem('authToken');
    };

  	return new Promise((resolve,reject)=>{
  		// Select device activated
      this.platform.ready().then(() => {
        // device is mobile
        if (this.platform.is('ios') || this.platform.is('android')) {
          // init file transfer
          this.nativeHTTP.get(this.url + '/' + endpoint, data, this.headers).then(success=>{
		        resolve(success);
		      },err=>{
		        this.setTokenExpired(err);	
		        reject(err);
		      });

        // device is webapp
        }else{
          let httpParams = new HttpParams({ fromObject: data });

        	this.baseHTTP.get(this.url + '/' + endpoint, {params: data, headers: this.headers}).subscribe((response) => {
	          resolve(response);
	        }, (error) => {
	          this.setTokenExpired(error);	
		        reject(error);
	        });
        };
      });
    });
  }

  post(endpoint: string, body?: any) {
  	if (localStorage.getItem('authToken')) {
      this.headers.Authorization=localStorage.getItem('authToken');
    };

  	return new Promise((resolve,reject)=>{
  		// Select device activated
      this.platform.ready().then(() => {
        // device is mobile
        if (this.platform.is('ios') || this.platform.is('android')) {
          // init file transfer
          this.nativeHTTP.post(this.url + '/' + endpoint, body, this.headers).then(success=>{
		        resolve(success);
		      },err=>{
		        this.setTokenExpired(err);	
		        reject(err);
		      });

        // device is webapp
        }else{
          let httpParams = new HttpParams({ fromObject: body });

        	this.baseHTTP.post(this.url + '/' + endpoint, httpParams, {headers: this.headers}).subscribe((response) => {
	          resolve(response);
	        }, (error) => {
	          this.setTokenExpired(error);	
		        reject(error);
	        });
        };
      });
    });
  }

  put(endpoint: string, body?: any) {
  	if (localStorage.getItem('authToken')) {
      this.headers.Authorization=localStorage.getItem('authToken');
    };

  	return new Promise((resolve,reject)=>{
  		// Select device activated
      this.platform.ready().then(() => {
        // device is mobile
        if (this.platform.is('ios') || this.platform.is('android')) {
          // init file transfer
          this.nativeHTTP.put(this.url + '/' + endpoint, body, this.headers).then(success=>{
		        resolve(success);
		      },err=>{
		        this.setTokenExpired(err);	
		        reject(err);
		      });

        // device is webapp
        }else{
        	this.baseHTTP.put(this.url + '/' + endpoint, {params: body, headers: this.headers}).subscribe((response) => {
	          resolve(response);
	        }, (error) => {
	          this.setTokenExpired(error);	
		        reject(error);
	        });
        };
      });
    });
  }

  delete(endpoint: string, body: any, reqOpts?: any) {
  	if (localStorage.getItem('authToken')) {
      this.headers.Authorization=localStorage.getItem('authToken');
    };

  	return new Promise((resolve,reject)=>{
  		// Select device activated
      this.platform.ready().then(() => {
        // device is mobile
        if (this.platform.is('ios') || this.platform.is('android')) {
          // init file transfer
          this.nativeHTTP.delete(this.url + '/' + endpoint, body, this.headers).then(success=>{
		        resolve(success);
		      },err=>{
		        this.setTokenExpired(err);	
		        reject(err);
		      });

        // device is webapp
        }else{
        	this.baseHTTP.delete(this.url + '/' + endpoint, {params: body, headers: this.headers}).subscribe((response) => {
	          resolve(response);
	        }, (error) => {
	          this.setTokenExpired(error);	
		        reject(error);
	        });
        };
      });
    });
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
  	if (localStorage.getItem('authToken')) {
      this.headers.Authorization=localStorage.getItem('authToken');
    };

  	return new Promise((resolve,reject)=>{
  		// Select device activated
      this.platform.ready().then(() => {
        // device is mobile
        if (this.platform.is('ios') || this.platform.is('android')) {
          // init file transfer
          this.nativeHTTP.patch(this.url + '/' + endpoint, body, this.headers).then(success=>{
		        resolve(success);
		      },err=>{
		        this.setTokenExpired(err);	
		        reject(err);
		      });

        // device is webapp
        }else{
        	this.baseHTTP.patch(this.url + '/' + endpoint, {params: body, headers: this.headers}).subscribe((response) => {
	          resolve(response);
	        }, (error) => {
	          this.setTokenExpired(error);	
		        reject(error);
	        });
        };
      });
    });
  }

  download(endpoint,name) {
    return new Promise((resolve,reject)=>{
      this.platform.ready().then(() => {
        // only process when device is mobile
        if (this.platform.is('ios') || this.platform.is('android')) {
          // init file transfer
          const fileTransfer: FileTransferObject = this.transfer.create();
          // set folder directory
          const folder:string = this.file.externalRootDirectory + '/Download/';
          // try to download
          fileTransfer.download(this.url + '/' + endpoint, folder+""+name).then((entry) => {
            console.log('mydownload complete: ',entry.toURL());
            resolve(entry.toURL());    
          }, (error) => {
            console.log('mydownload error: ',error);
            reject(error);
          });

        }else{
          reject('false');
        }
      });
    });
  }

  setTokenExpired(err){
    let myTokn = localStorage.getItem('authToken');

    if(myTokn!=undefined && myTokn!=""){
        if(err.status==401){
          // destroy existing data first
          this.helper._destroySession().then(() => {
            // redirect to login page
            this.helper.openPage('login');
          });
        }
    }
  }	
}
