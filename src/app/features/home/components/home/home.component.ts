import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  userDisplayName: string = 'Developer';

  constructor() {}

  ngOnInit(): void {
    // No authentication required for development
  }
}
