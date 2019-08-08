import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  items: any[] = []

  reservas: string[] = [];
  buscarReserva: any;

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.cargaReservas();
  }

  index: number = 1;
  
  cargaReservas(){
    for (let i = 0; i < 10; i++) {
      this.items.push({
        name: this.index + ' - ',
        content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
      });
      this.index++;
    }
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      
      for (let i = 0; i < 10; i++) {
        this.items.push({
          name: this.index + ' - ',
          content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
        });
        this.index++;
      }
      // and disable the infinite scroll
      if (this.items.length > 35) {
        event.target.disabled = true;
      }
    }, 500);
  }

  // toggleInfiniteScroll() {
  //   this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  // }


}
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
