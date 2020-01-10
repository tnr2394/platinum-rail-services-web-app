import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPassword]'
})
export class AppPasswordDirective {
  private _shown = false;

  constructor(public el: ElementRef) {
    console.log('Directive Called');
    this.setup();
  }

  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = 'Hide password';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = 'Show password';
    }
  }
  setup() {
    console.log('this.el.nativeElement.parentNode', this.el);
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.innerHTML = `Show password`;
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });

    console.log('parent', parent);
    parent.appendChild(span);
  }
}
