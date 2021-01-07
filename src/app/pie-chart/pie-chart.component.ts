import { Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import {
  ChartDimensions,
  СhartSettingsEvent
} from '../models/models';
import { RetailDcService } from '../services/retail-dc.service';
import { pieChart } from 'dc';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnDestroy {
  dimension: ChartDimensions;
  pieChart: pieChart;

  constructor(private retailDcService: RetailDcService) {}

  ngOnInit(): void {
    this.retailDcService
      .fetchDataDc()
      .pipe(take(1))
      .subscribe(() =>
        this.renderChartOnSettings({
          chartSettings: this.retailDcService.chartSettings
        })
      );

    this.retailDcService.chartSettingsUpdate$
      .pipe(untilDestroyed(this))
      .subscribe((settingsEvent: СhartSettingsEvent) => {
        this.renderChartOnSettings(settingsEvent);
      });
  }

  ngOnDestroy(): void {}

  private renderChartOnSettings(settings: СhartSettingsEvent): void {
    this.dimension = this.retailDcService.chartSettings.dimension;
    if (!this.pieChart) {
      this.pieChart = this.retailDcService.dcLib.pieChart('#pie-chart', 'pie');
    }
    if (!settings.chartSettings.filter.categories.length) {
      // eslint-disable-next-line no-underscore-dangle
      this.pieChart._filters = [];
    }
    if (settings?.sourceFilterChanges !== 'pie') {
      this.renderChart();
    }
  }

  private renderChart(): void {
    this.pieChart
      .width(700)
      .height(300)
      .slicesCap(10)
      .innerRadius(10)
      .externalLabels(30)
      .externalRadiusPadding(30)
      .dimension(this.retailDcService.pieDimension)
      .group(this.retailDcService.pieGroup)
      .legend(
        this.retailDcService.dcLib.legend().x(20).y(20).itemHeight(20).gap(5)
      )
      .transitionDuration(500);

    this.pieChart.label(
      (data: { key: string; value: string }) =>
        data.key + ': ' + parseInt(data.value, 10)
    );

    this.pieChart.on('filtered', (chart: pieChart) => {
      // eslint-disable-next-line no-underscore-dangle
      this.retailDcService.setCategoryFilter(chart._filters, 'pie');
    });

    this.retailDcService.dcLib.renderAll('pie');
  }
}
