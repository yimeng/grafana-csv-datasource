import _ from 'lodash';

import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/ui';
import { CSVQuery, CSVDataSourceOptions } from './types';
import { getBackendSrv } from '@grafana/runtime';

interface Request {
  queries: any[];
  from?: string;
  to?: string;
}

export class CSVDataSource extends DataSourceApi<CSVQuery, CSVDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<CSVDataSourceOptions>) {
    super(instanceSettings);
  }

  query(options: DataQueryRequest<CSVQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range.from.valueOf();
    const to = range.to.valueOf();

    const data: Request = {
      from: from.toString(),
      to: to.toString(),
      queries: options.targets.map((target: any) => {
        return {
          datasourceId: this.id,
          refId: target.refId,
          fields: target.fields,
        };
      }),
    };

    return getBackendSrv()
      .post('/api/tsdb/query', data)
      .then((response: any) => {
        const res: any = [];

        _.forEach(response.results, r => {
          _.forEach(r.series, s => {
            res.push({ target: s.name, datapoints: s.points });
          });
        });

        response.data = res;

        return response;
      });
  }

  testDatasource() {
    const data: Request = {
      from: '5m',
      to: 'now',
      queries: [
        {
          datasourceId: this.id,
        },
      ],
    };

    return getBackendSrv()
      .post('/api/tsdb/query', data)
      .then((response: any) => {
        return { status: 'success', message: 'Success' };
      })
      .catch((error: any) => {
        return { status: 'failed', message: 'Error' };
      });
  }
}
