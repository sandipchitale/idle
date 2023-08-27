import { ChangeDetectorRef, Component } from '@angular/core';
import {Idle, DocumentInterruptSource} from '@ng-idle/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  idleState = 'Not idle';
  countdown?: number | undefined;
  constructor(private idle: Idle, private changeDetectorRef: ChangeDetectorRef) {

    this.idle.setIdle(10); // 10 seconds of inactivity starts the countdown
    this.idle.setTimeout(10); // how long can they be idle before considered Timed out, in seconds
    this.idle.setInterrupts([new DocumentInterruptSource('keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);

    // do something when the user becomes idle
    this.idle.onIdleStart.subscribe(() => {
      this.idleState = "Idle";
    });

    // do something when the user is no longer idle
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = "Not idle";
      this.countdown = undefined;
      changeDetectorRef.detectChanges();
    });

    // do something when the user has Timed out
    this.idle.onTimeout.subscribe(() => {
      this.idleState = "Timed out (will start demo in 10 seconds again)";
      this.countdown = undefined;
      setTimeout(() => {
        this.idle.watch();
      }, 10000)
    });
    // do something as the timeout countdown does its thing
    this.idle.onTimeoutWarning.subscribe(seconds => {
      this.countdown = seconds
    });

    this.watch();
  }

  watch() {
    this.idleState = 'Not idle';

    this.idle.watch();
  }
}