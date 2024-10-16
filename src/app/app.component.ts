import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isModalOpen = false;

  @ViewChild('openModalButton') openModalButton!: ElementRef;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.openModalButton.nativeElement.focus(); // Set focus back to the open modal button
  }
}
