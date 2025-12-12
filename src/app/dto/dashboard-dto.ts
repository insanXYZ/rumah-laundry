export interface ChartIncomeExpend {
  date: string;
  income: number;
  expend: number;
}

export interface GetInformationDashoard {
  income: number;
  expend: number;
  total_order: number;
  total_finished_order: number;
  chart_income_expends: ChartIncomeExpend[];
}
