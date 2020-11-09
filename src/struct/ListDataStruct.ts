import AbstractStruct from './AbstractStruct';
import NoteCollection from './DataStructs/collection/NoteCollection';
import WorklogCollection from './DataStructs/collection/WorklogCollection';
import StopStruct from './DataStructs/stop';
import StartStruct from './DataStructs/start';

export default class ListDataStruct extends AbstractStruct {
  private _start: StartStruct;
  private _stop: StopStruct;
  private _estimatedStop: StopStruct;
  private _workDuration: object;
  private _breakDuration: object;
  private _notes: NoteCollection;
  private _worklogs: WorklogCollection;

  constructor(data?: object) {
    super();

    if (data) {
      this.fromObject(data);
    }
  }

  public getPrintData(order: string): object {
    const printData = [];

    if (this.start) {
      printData['0_start'] = this.start.getPrintData();
    }

    if (this.stop) {
      printData['1_stop'] = this.stop.getPrintData();
    }

    if (this.estimatedStop) {
      printData['1_stop'] = this.estimatedStop.getUnsetPrintData();
    }

    if (this.workDuration) {
      printData['2_duration'] = this.workDuration;
    }

    if (this.breakDuration) {
      printData['3_duration'] = this.breakDuration;
    }

    if (this.notes) {
      printData['4_notes'] = this.notes.getPrintData();
    }

    if (this.worklogs) {
      if (!this.start || !this.start.time) {
        if (this.worklogs.first() && this.worklogs.first().time) {
          const tmpStart = new Date(this.worklogs.first().time);
          printData['5_worklogs'] = this.worklogs.getCalculatedPrintData(tmpStart.getTime(), order);
        }
      } else {
        printData['5_worklogs'] = this.worklogs.getCalculatedPrintData(this.start.time.getTime(), order);
      }
    }

    return printData;
  }

  get start(): StartStruct {
    return this._start;
  }

  set start(value: StartStruct) {
    this._start = value;
  }

  get estimatedStop(): StopStruct {
    return this._estimatedStop;
  }

  set estimatedStop(value: StopStruct) {
    this._estimatedStop = value;
  }

  get stop(): StopStruct {
    return this._stop;
  }

  set stop(value: StopStruct) {
    this._stop = value;
  }

  get workDuration(): object {
    return this._workDuration;
  }

  set workDuration(value: object) {
    this._workDuration = value;
  }

  get breakDuration(): object {
    return this._breakDuration;
  }

  set breakDuration(value: object) {
    this._breakDuration = value;
  }

  get notes(): NoteCollection {
    return this._notes;
  }

  set notes(value: NoteCollection) {
    this._notes = value;
  }

  get worklogs(): WorklogCollection {
    return this._worklogs;
  }

  set worklogs(value: WorklogCollection) {
    this._worklogs = value;
  }
}
