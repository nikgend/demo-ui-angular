import { Component } from '@angular/core';

@Component({
  selector: 'app-scoping',
  templateUrl: './scoping.component.html',
  styleUrls: ['./scoping.component.scss'],
  standalone: false
})
export class ScopingComponent {
  activeTab: 'add' | 'details' = 'add';

  setActiveTab(tab: 'add' | 'details'): void {
    this.activeTab = tab;
  }
}
