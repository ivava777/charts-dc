/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line no-shadow
export enum ChartDimensions {
  markdown = 'markdown',
  revenues = 'revenues',
  margin = 'margin'
}

export interface СhartSettingsEvent {
  sourceFilterChanges?: string;
  chartSettings: СhartSettings;
}

export interface СhartSettings {
  dimension: ChartDimensions;
  filter: ChartFilter;
}

export interface ChartFilter {
  startDate: number;
  endDate: number;
  categories: string[];
}

export interface CSVRecord {
  item_code: string;
  item_category: string;
  year_ref: string;
  week_ref: string;
  markdown: string;
  revenues: string;
  margin: string;
  price: string;
  quantity: string;
  stock: string;
  exec_id: string;
  item_brand: string;
  category_desc: string;
  valuta: string;
  season: string;
  store: string;
  dm: string;
  region: string;
  channel: string;
  country: string;
  division: string;
}
