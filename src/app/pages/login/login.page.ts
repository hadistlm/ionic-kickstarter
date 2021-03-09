import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/api/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	@Input() data: any;

  public username: string;
  public password: string;

  public isUsernameValid: boolean;
  public isPasswordValid: boolean;

  public passwordType: string = "password";
  public passwordIcon: string = "eye-off";
  
  constructor(
    private authModule : AuthServiceService
  ) { 
    this.isUsernameValid= true;
    this.isPasswordValid = true;
  }

  ngOnInit() {
  	this.data = {
      "logo": "assets/icon/logo.png",
      "btnLogin": "Login",
      "txtUsername" : "Username",
      "txtPassword" : "Password",
      "txtForgotPassword" : "Forgot password?",
      "btnResetYourPassword": "Reset your password",
      "txtSignupnow" : "Don't have an account?",
      "btnSignupnow": "Signup now",
      "title": "Welcome back,",
      "subtitle": "please login to your account.",
      "errorUser" : "Field can't be empty.",
      "errorPassword" : "Field can't be empty."
    }
	}

  showPassword(){
    // change password input type
    this.passwordType = (this.passwordType=="password") ? "text" : "password";
    // change password icon
    this.passwordIcon = (this.passwordIcon=="eye-off") ? "eye" : "eye-off";
  }

  onEvent(event: string){
    if (event == "onLogin" && !this.validate()) {
        return;
    }

    switch (event) {
      case "onLogin":
      default:
        return this.authModule.login({
          username: this.username,
          password: this.password
        });
      break;
    } 
  }

  validate(){
    this.isUsernameValid = true;
    this.isPasswordValid = true;
    if (!this.username ||this.username.length == 0) {
        this.isUsernameValid = false;
    }

    if (!this.password || this.password.length == 0) {
        this.isPasswordValid = false;
    }
    
    return this.isPasswordValid && this.isUsernameValid;
  }

}
