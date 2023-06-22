import {
  Component,
  EventEmitter,
  Injectable,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDate,
} from '@ng-bootstrap/ng-bootstrap';
import { BookSeatService } from '../book-seat.service';

// service starts
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  // ('0' + formattedDate.getDate()).slice(-2);
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year
      : '';
  }
}
// service ends

@Component({
  selector: 'desk-book-book-seat-header',
  templateUrl: './book-seat-header.component.html',
  styleUrls: ['./book-seat-header.component.scss'],
})
export class BookSeatHeaderComponent implements OnInit {
  model!: NgbDateStruct;
  ngbCalendar: any;
  isDisabledfloor: boolean = true;
  public dateControl = new FormControl();
  minDate: { year: number; month: number; day: number };
  maxDate: { year: number; month: number; day: number };
  currentDate: number = this.calendar.getToday().day + 1;
  isDisabled: any;

  // selectCity: number | undefined;
  // selectFloor: number | undefined;
  cities: any;
  floors: any;
  date: any;
  public city = new FormControl();
  public floor = new FormControl();
  cityId: any;
  floorId: any;
  public isDisabledCity = true;
  public isDisabledFloor = true;
  selectedFloorValue: any;
  bookseatVisible: boolean = false;
  dropDownDisable!: boolean;
  public cityControl = new FormControl();
  public floorControl = new FormControl();

  @Output() openBookSeatEvent = new EventEmitter();
  @Output() selectedFloorValueEvent = new EventEmitter();
  getUserSeats: any;

  // fromDate2: number = this.calendar.getToday().day + 2;

  // getDate: any = new Date()
  // currentMonth: any = this.getDate.getMonth();
  // currentYear: any = this.getDate.getFullYear();

  constructor(
    private calendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private config: NgbDatepickerConfig,
    private bookSeatService: BookSeatService
  ) {
    //this.disbaledate();
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate() + 2, // get current date +2(day will select after 2 days)
    };
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 4,
      day: current.getDate(),
    };
    this.weekendsDisable();
    this.isDisabledCity = false;
  }

  ngOnInit(): void {
    this.isDisabledfloor;
    console.log(this.currentDate);
    this.dropDownDisable = false;
    this.isDisabledCity = true;
    //get cities
    this.bookSeatService.getCities().subscribe((res: any) => {
      this.cities = res.data;
    });
  }

  onDateChange() {
    this.isDisabledCity = false;
    this.cityControl.reset();
    this.floorControl.reset();
    this.isDisabledFloor = true;
    let day = String(this.dateControl.value.day).padStart(2, '0');
    let month = String(this.dateControl.value.month).padStart(2, '0');
    let year = String(this.dateControl.value.year);
    this.date = `${month}/${day}/${year}`;
    console.log(this.date);
    this.bookSeatService.date.next(this.date);
  }

  // Disable weekends
  weekendsDisable() {
    this.config.outsideDays = 'hidden';
    this.config.markDisabled = (date: NgbDateStruct) => {
      const day = this.calendar.getWeekday(
        new NgbDate(date.year, date.month, date.day)
      );
      return day === 6 || day === 7; // 6: Saturday, 0: Sunday
    };
  }
  //date format
  // selectToday() {
  //   this.model = this.calendar.getToday();
  // }
  // get today() {
  //   return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  // }

  //get floor
  getFloorByCity(cityId: number) {
    this.bookSeatService.getFloors(cityId).subscribe((res: any) => {
      this.floors = res.data;
    });
  }

  //floor disabled
  onCitySelect(value: any) {
    if (value) {
      this.floorControl.reset();
      console.log(value);

      this.cityId = value.id;
      this.isDisabledFloor = false;
    } else {
      this.isDisabledFloor = true;
    }
    this.getFloorByCity(value.id);
  }

  //get floor
  onChangeFloor(value: any) {
    if (value) {
      this.floorId = value.id;
      this.selectedFloorValue = value;
      this.getSeatsData({
        cityId: this.cityId,
        floorId: this.floorId,
        date: this.date,
      });
      this.bookSeatService.floorName.next(value.name);
      setTimeout(() => {
        this.bookSeatService.cityAndFloorId.next({
          ...this.selectedFloorValue,
          cityId: this.cityId,
        });
      }, 500);
    } else {
      this.bookseatVisible;
    }
    this.openBookSeatEvent.emit(this.bookseatVisible);
  }

  getSeatsData(data: any) {
    this.bookSeatService.getSeats(data).subscribe((res: any) => {
      this.bookSeatService.seat.next(res.data);
    });
  }

  getAllUsearSeats(data: any) {
    this.bookSeatService.getSeats(data).subscribe((res: any) => {
      this.getUserSeats = res.data;
      this.bookSeatService.getAllUserSeats.next(this.getUserSeats);
    });
  }
}
