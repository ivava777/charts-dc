import { take, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as crossfilter from 'crossfilter2/crossfilter';
import * as dc from 'dc';
import * as d3 from 'd3';
import { pieDimension, pieGroup, lineDimension, lineGroup } from 'dc';

import {
  ChartDimensions,
  ChartFilter,
  CSVRecord,
  СhartSettings,
  СhartSettingsEvent
} from '../models/models';
import { RetailDataService } from './retail-data.service';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetailDcService {
  initFilterValue: ChartFilter = {
    startDate: null,
    endDate: null,
    categories: []
  };
  initChartSettings: СhartSettings = {
    dimension: ChartDimensions.margin,
    filter: this.initFilterValue
  };
  chartSettingsUpdate$ = new Subject<СhartSettingsEvent>();
  chartSettings: СhartSettings = this.initChartSettings;
  crossfilter: crossfilter.Crossfilter<CSVRecord>;
  dcLib: dc = dc;
  d3Lib: d3 = d3;

  pieDimension: pieDimension;
  pieGroup: pieGroup;

  lineDimension: lineDimension;
  lineGroup: lineGroup;

  private data: CSVRecord[];

  constructor(private retailDataService: RetailDataService) {}

  fetchDataDc(): Observable<CSVRecord[]> {
    if (!this.data) {
      return this.retailDataService.fetchData().pipe(
        take(1),
        tap((data) => {
          this.data = data;
          this.updateCrossfilter();
        })
      );
    } else {
      return of(this.data);
    }
  }

  setDimension(dimension: ChartDimensions): void {
    this.chartSettings = { ...this.chartSettings, dimension };
    this.updateChartGroups();
    this.chartSettingsUpdate$.next({ chartSettings: this.chartSettings });
  }

  updateCrossfilter(): void {
    this.crossfilter = crossfilter(this.data);
    this.pieDimension = this.crossfilter.dimension(
      (data: CSVRecord) => data.item_category
    );
    this.lineDimension = this.crossfilter.dimension(
      (data: CSVRecord) => data.week_ref
    );
    this.updateChartGroups();
    this.chartSettingsUpdate$.next({ chartSettings: this.chartSettings });
  }

  updateChartGroups(sourceChanges: string = null): void {
    if (sourceChanges !== 'pie') {
      this.pieGroup = this.pieDimension
        .group()
        .reduceSum((d: CSVRecord) => d[this.chartSettings.dimension]);
    }
    if (sourceChanges !== 'line') {
      this.lineGroup = this.lineDimension
        .group()
        .reduceSum((d: CSVRecord) => d[this.chartSettings.dimension]);
    }
  }

  lineChartX(): () => void {
    return d3
      .scaleLinear()
      .domain([
        d3.min(this.data, (record: CSVRecord): number => +record.week_ref),
        d3.max(this.data, (record: CSVRecord): number => +record.week_ref + 1)
      ]);
  }

  setTimeRange(
    startDate: number,
    endDate: number,
    sourceFilterChanges: string
  ): void {
    this.chartSettings = {
      ...this.chartSettings,
      filter: { ...this.chartSettings.filter, startDate, endDate }
    };
    this.chartSettingsUpdate$.next({
      chartSettings: this.chartSettings,
      sourceFilterChanges
    });
  }

  setCategoryFilter(categories: string[], sourceFilterChanges: string): void {
    this.chartSettings = {
      ...this.chartSettings,
      filter: { ...this.chartSettings.filter, categories }
    };
    this.chartSettingsUpdate$.next({
      chartSettings: this.chartSettings,
      sourceFilterChanges
    });
  }

  resetFilter(): void {
    this.chartSettings = {
      ...this.chartSettings,
      filter: this.initFilterValue
    };
    this.updateCrossfilter();
  }
}
