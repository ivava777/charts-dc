import { Observable } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ChartDimensions,
  ChartFilter,
  СhartSettingsEvent
} from '../models/models';
import { RetailDcService } from '../services/retail-dc.service';
import { enumToArray } from '..//shared/common';
import { MatSelectChange } from '@angular/material/select';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  chartDimensionsArray = enumToArray(ChartDimensions);
  dimensionSelectedKey: string;
  filterValue$: Observable<ChartFilter>;

  constructor(private retailDcService: RetailDcService) {}

  ngOnInit(): void {
    this.dimensionSelectedKey = this.retailDcService.initChartSettings.dimension;
    this.filterValue$ = this.retailDcService.chartSettingsUpdate$.pipe(
      map(
        (chartSettingsEvent: СhartSettingsEvent) =>
          chartSettingsEvent.chartSettings.filter
      )
    );
  }

  handleDimensionSelect(chartDimensionSelect: MatSelectChange): void {
    this.retailDcService.setDimension(
      ChartDimensions[chartDimensionSelect.value]
    );
  }

  onResetFilter(): void {
    this.retailDcService.resetFilter();
  }
}
