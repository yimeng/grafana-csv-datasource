import React, { PureComponent, ChangeEvent } from 'react';

import { DataSourcePluginOptionsEditorProps, DataSourceSettings, FormField } from '@grafana/ui';

import { CSVDataSourceOptions } from './types';

type CSVSettings = DataSourceSettings<CSVDataSourceOptions>;

interface Props extends DataSourcePluginOptionsEditorProps<CSVSettings> {}

interface State {}

export class CSVConfigEditor extends PureComponent<Props, State> {
  componentDidMount() {}

  onPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      path: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField label="Path" value={jsonData.path || ''} onChange={this.onPathChange} />
        </div>
      </div>
    );
  }
}
