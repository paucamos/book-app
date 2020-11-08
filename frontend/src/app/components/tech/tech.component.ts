import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: []
})
export class TechComponent implements OnInit {

  constructor() {}

  allTech = [
    {
      id: 1,
      name: 'Angular',
      tag: 'frontend'
    },
    {
      id: 2,
      name: 'Lodash',
      tag: 'frontend'
    },
    {
      id: 3,
      name: 'Material Design',
      tag: 'frontend'
    },
    {
      id: 4,
      name: 'Node',
      tag: 'backend'
    },
    {
      id: 5,
      name: 'Express',
      tag: 'backend'
    },
    {
      id: 6,
      name: 'MongoDB',
      tag: 'database'
    }
  ];

  ngOnInit(): void {
  }

}
