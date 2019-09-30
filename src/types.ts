import { DataQuery, DataSourceJsonData } from '@grafana/ui';

export interface CSVQuery extends DataQuery {
  fields?: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface CSVDataSourceOptions extends DataSourceJsonData {
  path?: string;
}
