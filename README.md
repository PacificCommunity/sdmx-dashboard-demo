# Dashboard generator

This webapp displays dashboards according to configuration
provided by YAML files uploaded by end users.

## Configuration

By default YAML files are saved in local file system (in `./public/uploads/` folder)

To store YAML files as Github Gists, add 2 environment variables  
(in .env.local for instance)

```
GIST_TOKEN=<your_github_token>
GIST_PUBLIC=false
```

## Running the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## General documentation

This application uses SDMX-JSON format for the data (version 2) provided by the [sdmx-json-parser library](https://pacificcommunity.github.io/sdmx-json-parser/).

It is built upon NextJS with [Bootstrap](https://pacificcommunity.github.io/sdmx-json-parser/), [Highcharts](https://www.highcharts.com/) and [OpenLayers](https://openlayers.org/).


New types of charts have been added. The specification of the related YAML sections is provided below:

1. Drilldown

Drilldown chart make use of multi-dimensional datasets displaying a single value for each category in columns and a disagreggated serie of observation for each category by another dimension.
The second dimension can be `TIME_PERIOD` in such case the drilled down chart type will be a line chart or another dimension in which case the chart type will remain column.
When using the `TIME_PERIOD` dimension, the main view present the latest value available, whereas for other kind of dimension, the value `Total` (`_T`) is displayed (must be available for this dimension).

`legendConcept` holds the dimension displayed on the main map and `xAxisConcept` holds the dimension name used for the drilled-down view.


```yaml
-
    Row: 1
    chartType: DRILLDOWN, double
    Title:  "Household Expenditure"
    Subtitle:  "{$TIME_PERIOD}"
    Unit:
    unitLoc: SUFFIX
    Decimals: "{$DECIMALS}"
    LabelsYN: No
    legendConcept: GEO_PICT
    legendLoc: 
    xAxisConcept: COMMODITY 
    yAxisConcept: 
    downloadYN: 
    dataLink: 
    metadataLink: 
    DATA: "https://stats-sdmx-disseminate.pacificdata.org/rest/data/SPC,DF_HHEXP,1.0/A..HHEXP._T._T.10+11+12+01+02+03+04+05+06+07+08+09+_T.USD?startPeriod=2013&endPeriod=2021&lastNObservations=1&dimensionAtObservation=AllDimensions"
    
```


2. Map


In order to display some observation on a map, we need to associate them to geometries. It means that we need a source for geometries and an association as associated keys matching a dimension of the SDMX dataset and an attribute of the GIS file.
GeoJSON is the only implemented format for GIS files.
The project of the GIS file must be specified. All these information are provided in the `DATA` field.
The syntax of the `DATA` field is as follow:

SDMX_URL, {GEO_DIMENSION_ID} | GEOJSON_URL, EPSG_CODE, {GEO_ATTRIBUTE}

- SDMX_URL : the URL to the SDMX dataset
- GEO_DIMENSION_ID: id of the dimension holding reference to the area of application
- GEOJSON_URL: a URL to a GeoJSON file holding the geometries
- EPSG_CODE: the projection code (eg. 'EPSG:4326')
- GEO_ATTRIBUTE: name of the attribute holding a reference to the geometry (value of this attribute must be equal to the SDMX dimension id value). 

The `legendConcept` dimension name is displayed in the tooltip. This holds the description of the data (usually is set to 'MEASURE', 'INDICATOR', ...)

```yaml
-
    Row: 1
    chartType: MAP, double
    Title:  "Inflation rate"
    Subtitle:  "{$TIME_PERIOD}"
    Unit:
    unitLoc: SUFFIX
    Decimals: "{$DECIMALS}"
    LabelsYN: No
    legendConcept: INDICATOR
    legendLoc: 
    xAxisConcept:
    yAxisConcept: OBS_VALUE 
    downloadYN: 
    dataLink: 
    metadataLink: 
    DATA: "https://stats-sdmx-disseminate.pacificdata.org/rest/data/SPC,DF_CPI,3.0/A..INF.?startPeriod=2011&lastNObservations=1&dimensionAtObservation=AllDimensions, {GEO_PICT} | https://www.spc.int/modules/contrib/spc_dot_stat_data/modules/spc_dot_stat_map/maps/eez.json, EPSG:3832, {id}"
```