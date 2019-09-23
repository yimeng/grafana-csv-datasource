package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	gf "github.com/grafana/grafana-plugin-sdk-go"
	"github.com/grafana/grafana-plugin-sdk-go/dataframe"
)

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

const pluginID = "marcusolsson-csv-datasource"

func (d *CSVDatasource) Query(ctx context.Context, tr gf.TimeRange, ds gf.DatasourceInfo, queries []gf.Query) ([]gf.QueryResult, error) {
	var opts CSVOptions
	if err := json.Unmarshal(ds.JSONData, &opts); err != nil {
		return nil, err
	}

	var res []gf.QueryResult

	for _, q := range queries {
		var query CSVQuery
		if err := json.Unmarshal(q.ModelJSON, &query); err != nil {
			d.logger.Println(err)
			continue
		}

		fields := strings.Split(query.Fields, ",")

		frame, err := parseCSV(opts.Path, fields)
		if err != nil {
			d.logger.Println(err)
			continue
		}

		for _, v := range frame.Fields {
			d.logger.Printf("%+v", v)
		}

		res = append(res, gf.QueryResult{
			RefID:      query.RefID,
			DataFrames: []*dataframe.DataFrame{frame},
		})
	}

	return res, nil
}

func main() {
	logger := log.New(os.Stderr, "", 0)

	g := gf.NewServer()

	g.HandleDatasource(pluginID, &CSVDatasource{
		logger: logger,
	})

	if err := g.Serve(); err != nil {
		logger.Fatal(err)
	}
}

func parseCSV(path string, fields []string) (*dataframe.DataFrame, error) {
	if len(fields) < 2 {
		return &dataframe.DataFrame{}, nil
	}

	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	reader := csv.NewReader(f)

	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	columns := make(map[string][]string)

	var header []string
	for _, rec := range records {
		if len(header) == 0 {
			header = rec
		} else {
			for i, val := range rec {
				columns[header[i]] = append(columns[header[i]], val)
			}
		}
	}

	var dffs []*dataframe.Field
	for _, n := range fields {
		vs, ok := columns[n]
		if !ok {
			continue
		}

		if tryType(vs, dataframe.FieldTypeTime) {
			res := make([]time.Time, 0)
			for _, v := range vs {
				t, _ := time.Parse(time.RFC3339, v)
				res = append(res, t)
			}
			dffs = append(dffs, dataframe.NewField(n, dataframe.FieldTypeTime, res))
		} else if tryType(vs, dataframe.FieldTypeNumber) {
			res := make([]float64, 0)
			for _, v := range vs {
				f, _ := strconv.ParseFloat(v, 64)
				res = append(res, f)
			}
			dffs = append(dffs, dataframe.NewField(n, dataframe.FieldTypeNumber, res))
		} else {
			dffs = append(dffs, dataframe.NewField(n, dataframe.FieldTypeString, vs))
		}
	}

	return dataframe.New(path, dataframe.Labels{}, dffs...), nil
}

func tryType(vals []string, t dataframe.FieldType) bool {
	for _, v := range vals {
		switch t {
		case dataframe.FieldTypeTime:
			_, err := time.Parse(time.RFC3339, v)
			if err != nil {
				return false
			}
		case dataframe.FieldTypeNumber:
			_, err := strconv.ParseFloat(v, 64)
			if err != nil {
				return false
			}
		}
	}

	return true
}
