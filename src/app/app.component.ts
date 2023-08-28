import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {Idle, DocumentInterruptSource} from '@ng-idle/core';
import {DOCUMENT} from "@angular/common";

enum STATE {
  NOT_IDLE,
  IDLE,
  TIMED_OUT
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  lightTheme = true;

  idleAfterSeconds = 5;
  timeoutWarningSeconds = 5;
  timeoutAfterSeconds = 10;

  state: STATE = STATE.NOT_IDLE;

  idleState = 'Not idle';
  _countdown?: number | undefined;

  countdownDialogVisible = false;

  constructor(private idle: Idle,
              private changeDetectorRef: ChangeDetectorRef,
              @Inject(DOCUMENT) private document: Document) {
    this.watch();
  }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit(): void {
    this.adjustTheme();
  }

  adjustTheme(event?: any) {
    let theme;
    if (this.lightTheme) {
      theme = 'light-theme';
    } else {
      theme = 'dark-theme';
    }
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }

  watch() {
    this.idle.stop();

    this.state = STATE.NOT_IDLE;
    this.idleState = 'Not idle';

    this.idle.setIdle(this.idleAfterSeconds); // 10 seconds of inactivity starts the countdown
    this.idle.setTimeout(this.timeoutAfterSeconds); // how long can they be idle before considered Timed out, in seconds
    this.idle.setInterrupts([new DocumentInterruptSource('keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);

    // do something when the user becomes idle
    this.idle.onIdleStart.subscribe(() => {
      this.state = STATE.IDLE;
      this.idleState = "Idle";
    });

    // do something when the user is no longer idle
    this.idle.onIdleEnd.subscribe(() => {
      this.state = STATE.NOT_IDLE;
      this.idleState = "Not idle";
      this.countdown = undefined;
      this.changeDetectorRef.detectChanges();
    });

    // do something when the user has Timed out
    this.idle.onTimeout.subscribe(() => {
      this.state = STATE.TIMED_OUT;
      this.idleState = `Timed out (Click Restart demo)`;
      this.countdown = undefined;
    });
    // do something as the timeout countdown does its thing
    this.idle.onTimeoutWarning.subscribe(seconds => {
      this.countdown = seconds
    });

    this.idle.watch();
  }

  get countdown() {
    return this._countdown;
  }

  set countdown(newCountdown: number | undefined) {
    this._countdown = newCountdown;
    this.countdownDialogVisible = (this._countdown != undefined && this._countdown <= this.timeoutWarningSeconds);
  }

  protected readonly STATE = STATE;
}
