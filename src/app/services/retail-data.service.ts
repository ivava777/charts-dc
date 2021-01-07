import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { CSVRecord } from '../models/models';
import { Observable } from 'rxjs';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class RetailDataService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private FILE_NAME = '../../assets/data.csv';

  constructor(private http: HttpClient) {}

  fetchData(): Observable<CSVRecord[]> {
    return this.http.get(this.FILE_NAME, { responseType: 'text' }).pipe(
      take(1),
      map((data) => d3.csvParse(data))
    );
  }
}
