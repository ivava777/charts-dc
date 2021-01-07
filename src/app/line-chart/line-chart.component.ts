import { СhartSettingsEvent, ChartDimensions } from './../models/models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { RetailDcService } from '../services/retail-dc.service';
import { lineChart } from 'dc';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnDestroy {
  dimension: ChartDimensions;
  lineChart: lineChart;

  constructor(private retailDcService: RetailDcService) {}

  ngOnInit(): void {
    this.lineChart = this.retailDcService.dcLib.lineChart(
      '#line-chart',
      'line'
    );
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
      .subscribe((chartSettingsEvent: СhartSettingsEvent) =>
        this.renderChartOnSettings(chartSettingsEvent)
      );
  }

  renderChartOnSettings(settings: СhartSettingsEvent) {
    this.dimension = this.retailDcService.chartSettings.dimension;
    if (settings?.sourceFilterChanges !== 'line') {
      this.renderChart();
    }
  }

  renderChart(): void {
    this.lineChart
      .width(800)
      .height(300)
      .margins({ top: 20, right: 80, bottom: 40, left: 80 })
      .x(this.retailDcService.lineChartX())
      .curve(this.retailDcService.d3Lib.curveLinear)
      .renderDataPoints(true)
      .renderArea(false)
      .brushOn(true)
      .clipPadding(10)
      .xAxisLabel('weeks')
      .yAxisLabel(this.retailDcService.chartSettings.dimension)
      .dimension(this.retailDcService.lineDimension)
      .group(this.retailDcService.lineGroup)
      .elasticY(true)
      .on('renderlet', () => {
        this.retailDcService.d3Lib.selectAll('.line').style('fill', 'none');
      });

    this.lineChart.on('filtered', (chart: lineChart, filter: number[]) => {
      if (filter != null) {
        this.retailDcService.setTimeRange(
          Math.floor(filter[0]),
          Math.ceil(filter[1]),
          'line'
        );
      }
    });

    this.retailDcService.dcLib.renderAll('line');
  }

  ngOnDestroy(): void {}
}
