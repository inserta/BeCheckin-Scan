import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  items: any[] = [];
  constructor(
    private loader: LoadingService
  ) { 
    for (let i = 0; i < 10; i++) {
      this.items.push({
        name: i + ' - ' + images[rotateImg],
        imgSrc: getImgSrc(),
        avatarSrc: getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
      });

      rotateImg++;
      if (rotateImg === images.length) {
        rotateImg = 0;
      }
    }
    if(this.loader.isLoading){
      this.loader.dismiss();
    }
  }

  ngOnInit() {
    // this.cargaReservas();
  }

  cargaReservas() {
    for (let i = 0; i < 10; i++) {
      this.items.push({
        name: i + ' - ',
        content: "prueba"
      });
    }
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded

      event.target.disabled = true;
    }, 500);
  }
}
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const images = [
  'bandit',
  'batmobile',
  'blues-brothers',
  'bueller',
  'delorean',
  'eleanor',
  'general-lee',
  'ghostbusters',
  'knight-rider',
  'mirth-mobile'
];

function getImgSrc() {
  const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
  rotateImg++;
  if (rotateImg === images.length) {
    rotateImg = 0;
  }
  return src;
}

let rotateImg = 0;