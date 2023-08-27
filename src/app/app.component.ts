import { ChangeDetectorRef, Component } from '@angular/core';
import {Idle, DocumentInterruptSource} from '@ng-idle/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  idleAfterSeconds = 10;
  timeoutAfterSeconds = 10;
  demoRestartAfterSeconds = 10;

  idleState = 'Not idle';
  countdown?: number | undefined;
  constructor(private idle: Idle, private changeDetectorRef: ChangeDetectorRef) {
    this.watch();
  }

  watch() {
    this.idleState = 'Not idle';

    this.idle.setIdle(this.idleAfterSeconds); // 10 seconds of inactivity starts the countdown
    this.idle.setTimeout(this.timeoutAfterSeconds); // how long can they be idle before considered Timed out, in seconds
    this.idle.setInterrupts([new DocumentInterruptSource('keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);

    // do something when the user becomes idle
    this.idle.onIdleStart.subscribe(() => {
      this.idleState = "Idle";
    });

    // do something when the user is no longer idle
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = "Not idle";
      this.countdown = undefined;
      this.changeDetectorRef.detectChanges();
    });

    // do something when the user has Timed out
    this.idle.onTimeout.subscribe(() => {
      this.idleState = `Timed out (will restart demo in ${this.demoRestartAfterSeconds} seconds again)`;
      this.countdown = undefined;
      setTimeout(() => {
        this.watch();
      }, (this.demoRestartAfterSeconds * 1000))
    });
    // do something as the timeout countdown does its thing
    this.idle.onTimeoutWarning.subscribe(seconds => {
      this.countdown = seconds
    });

    this.idle.watch();
  }
}
