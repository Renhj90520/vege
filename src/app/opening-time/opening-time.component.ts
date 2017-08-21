import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-opening-time',
  templateUrl: './opening-time.component.html',
  styleUrls: ['./opening-time.component.css']
})
export class OpeningTimeComponent implements OnInit {

  constructor( @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.document.body.scrollTop = 0;
  }

}
