import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../service/helper.service';
import { ElementService } from '../service/element.service';
import { ConnectionService } from '../service/connection.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
  	private router : Router,
  	public helper:HelperService,
  	public element:ElementService,
    public api:ConnectionService,
  ) { }

  login(param: any) {

    let seq = this.api.post('Auth/login', param);

    seq.then((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      let response=JSON.parse(res.data);

      if (response.status) {
        this.helper._createSession(response.data).then((res: any) => {
	        // If the API returned a successful response, mark the user as logged in
	        if(res){
	          this.router.navigateByUrl('dashboard');    
	        }      
	      }, err => {
	        alert("Sorry, this system not support for your device");
	      });
      } 
      else{
        this.element.showToast(response.msg);
      }

    }, err => {
      let errorData = this.helper._isJson(err.error) ? JSON.parse(err.error) : null;

      if (errorData && errorData.text) {
        this.element.showToast(errorData.text, 'warning', 'top');
      }else{
        this.element.showToast("The operation couldn't be completed. Please check your connection or try again later.", 'danger');
      }
    });

    return seq;
  }

  logout(){
    return new Promise<any>((resolve, reject) => {
      this.api.post('Auth/logout', {}).then((feedback: any) => {
        // If the API returned a successful response, mark the user as logged in
        let response=JSON.parse(feedback.data);

        resolve(response)
      }, err => {
        let errorData = this.helper._isJson(err.error) ? JSON.parse(err.error) : null;

        if (errorData && errorData.text) {
          this.element.showToast(errorData.text, 'warning', 'top');
        }else{
          this.element.showToast("The operation couldn't be completed. Please check your connection or try again later.", 'danger');
        }
        reject(errorData);
      });
    });
  }
}
