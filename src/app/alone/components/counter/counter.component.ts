import { Component, Input } from '@angular/core';

@Component({
  selector: 'alone-counter',
  standalone: true,
  // imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {
  @Input()
  public counter: number = 10;
}
