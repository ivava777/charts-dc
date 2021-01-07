import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { CSVRecord } from '../models/models';
import { Observable } from 'rxjs';
import * as d3 from 'd3';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetailDataService {
  private fileName = environment.dataFileUrl;

  constructor(private http: HttpClient) {}

  fetchData(): Observable<CSVRecord[]> {
    return this.http.get(this.fileName, { responseType: 'text' }).pipe(
      take(1),
      map((data) => d3.csvParse(data))
    );
  }
}
