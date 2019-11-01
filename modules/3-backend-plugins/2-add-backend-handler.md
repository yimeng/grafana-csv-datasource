# Add a backend handler

```
type CSVQuery struct {
	RefID  string `json:"refId"`
	Fields string `json:"fields"`
}

type CSVOptions struct {
	Path string `json:"path"`
}

type CSVDatasource struct {
	logger *log.Logger
}

func (d *CSVDatasource) ID() string {
	return "marcusolsson-csv-datasource"
}

func (d *CSVDatasource) Query(ctx context.Context, tr gf.TimeRange, ds gf.Datasource, queries []gf.Query) ([]gf.QueryResult, error) {
	var opts CSVOptions
	if err := json.Unmarshal(ds.JsonData, &opts); err != nil {
		return nil, err
	}

	var res []gf.QueryResult

	for _, q := range queries {
		var query CSVQuery
		if err := json.Unmarshal(q.ModelJson, &query); err != nil {
			return nil, err
		}

		fields := strings.Split(query.Fields, ",")

		frame, err := parseCSV(opts.Path, fields)
		if err != nil {
			return nil, err
		}

		res = append(res, gf.QueryResult{
			RefID:      query.RefID,
			DataFrames: []gf.DataFrame{frame},
		})
	}

	return res, nil
}
```

> _Note:_ I've left the implementation for `parseCSV` out of this article for brevity purposes, but feel free to check it out in full on [Github](https://github.com/marcusolsson/grafana-csv-datasource/blob/master/pkg/main.go).
