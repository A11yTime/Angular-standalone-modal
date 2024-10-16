import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ModalDialogComponent implements AfterViewInit, OnDestroy {
  @Input() isOpen: boolean = false; // Controls visibility
  @Output() close = new EventEmitter<void>(); // Event for closing the modal
  // @ViewChild('modalContent') modalContent!: ElementRef; // Reference to the modal content
  @ViewChild('firstFocusable') firstFocusable!: ElementRef; // Reference to the first focusable element
  @ViewChild('lastFocusable') lastFocusable!: ElementRef; // Reference to the last focusable element

  form: FormGroup; // Form group for the modal form
  private previousActiveElement: Element | null = null; // To store the previously focused element

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    if (this.isOpen) {
      this.trapFocus(); // Trap focus when modal opens
    }
  }

  ngOnChanges() {
    if (this.isOpen) {
      setTimeout(() => {
        this.trapFocus(); // Trap focus when modal opens
      });
    }
  }

  ngOnDestroy() {
    this.restoreFocus(); // Restore focus on modal close
  }

  private trapFocus() {
    this.previousActiveElement = document.activeElement; // Save the currently focused element
    this.firstFocusable.nativeElement.focus(); // Focus the first focusable element

    // Listen for keydown events to manage focus
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === this.firstFocusable.nativeElement) {
            event.preventDefault();
            this.lastFocusable.nativeElement.focus();
          }
        } else { // Tab
          if (document.activeElement === this.lastFocusable.nativeElement) {
            event.preventDefault();
            this.firstFocusable.nativeElement.focus();
          }
        }
      } else if (event.key === 'Escape') {
        this.onClose(); // Close the modal on Escape
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Remove event listener when modal is closed
    this.close.subscribe(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  }

  private restoreFocus() {
    if (this.previousActiveElement) {
      (this.previousActiveElement as HTMLElement).focus(); // Restore focus to the previous element
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
      this.onClose(); // Optionally close the modal on submit
    }
  }

  onClose() {
    this.close.emit(); // Emit close event
  }
}
