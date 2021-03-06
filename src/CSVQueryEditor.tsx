import React, { PureComponent, ChangeEvent } from 'react';

import { FormField, QueryEditorProps } from '@grafana/ui';

import { CSVDataSource, CSVQuery, CSVOptions } from './CSVDataSource';

type Props = QueryEditorProps<CSVDataSource, CSVQuery, CSVOptions>;

interface State {}

export class CSVQueryEditor extends PureComponent<Props, State> {
  onComponentDidMount() {}

  onFieldsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, fields: event.target.value });
  };

  render() {
    const { query } = this.props;
    const { fields } = query;

    return (
      <div className="gf-form">
        <FormField label="Fields" value={fields || ''} onChange={this.onFieldsChange} />
      </div>
    );
  }
}
