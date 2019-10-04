import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  @Input() src = '';
  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() tipo = '';

  slideOpts = {
    centeredSlides: 'true'
  };

  constructor(
    private modalController: ModalController,
    public sanitizer: DomSanitizer
    ) {}

  ngOnInit() {

  }

  closeModal() {
    this.modalController.dismiss();
  }
}