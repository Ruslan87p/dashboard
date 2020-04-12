import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  constructor() { }

  // binding class .open
  @HostBinding('class.open') isOpen = false;

  // make toggle click adding and removing class dropdown
  @HostListener('click') onClick() {
    this.isOpen = !this.isOpen;
  }

}
