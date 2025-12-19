export interface PayloadJWT {
  sub: string;
  tz: string;
}

export const SANTRI_LIMIT_KG_ORDER = 25;
export const SANTRI_CHARGE_PRICE = 6000;

export const ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI: string[] = [
  "cuci saja",
  "cuci setrika",
];
export const ACCEPTED_STATUS_ORDER: string[] = ["proses", "beres"];
export const ACCEPTED_UNIT: string[] = ["kg", "pcs"];

export const PRICE_TYPE_MONTHLY_MONEY_MAP = new Map<string, number>([
  [ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI[0], 100000],
  [ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI[1], 140000],
]);
