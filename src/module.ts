import { DataSourcePlugin } from '@grafana/ui';

import { CSVDataSource } from './CSVDataSource';
import { CSVConfigEditor } from './CSVConfigEditor';
import { CSVQueryEditor } from './CSVQueryEditor';
import { CSVDataSourceOptions, CSVQuery } from './types';

export const plugin = new DataSourcePlugin<CSVDataSource, CSVQuery, CSVDataSourceOptions>(CSVDataSource)
  .setConfigEditor(CSVConfigEditor)
  .setQueryEditor(CSVQueryEditor);
