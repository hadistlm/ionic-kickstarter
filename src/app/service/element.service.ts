import { Injectable } from '@angular/core';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from 'ion2-calendar';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ElementService {

	public loadingState:boolean = false;

  constructor(
  	public toastController:ToastController,
    public modalController: ModalController,
    public loadingController: LoadingController,
  ) { }

  async showLoading() {
    if (!this.loadingState) {
      this.loadingState = true;
      return await this.loadingController.create({
        // duration: 5000,
        message: 'Please wait...',
        translucent: true,
        mode: 'ios'
      }).then(a => {
        a.present().then(() => {
          if (!this.loadingState && a) {
            // this.dismissLoading();
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
    }
    else{
      return;
    }
  }

  async dismissLoading(){
    return await new Promise((resolve) => setTimeout(() => {
      this.loadingState = false;
      this.loadingController.getTop().then(a => {
        if ( a ) {
          a.dismiss().then(() => console.log('loading dismissed'));
        }
      })
      resolve('true');
    }, 2000));
  }

  async showToast(msg, colorType = null, positionType = null){
    const toast = await this.toastController.create({
      message: msg,
      color: (colorType) ? colorType : 'dark',
      position: (positionType) ? positionType : 'bottom',
      duration: 3000
    });
    toast.present();
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'single',
      from: new Date(2020, 0, 1),
      to: new Date(),
      defaultScrollTo: moment().startOf('month').toDate(),
      defaultDate: new Date(),
      title: '',
      step: 1
    };
 
    const myCalendar = await this.modalController.create({
      component: CalendarModal,
      componentProps: { options }
    });
 
    myCalendar.present();
 
    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;

    return date;
  }
}
