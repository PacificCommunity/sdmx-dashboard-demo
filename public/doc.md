# How write a configuration file for dashboard-creator

## Introduction

The dashboards are created by the `sdmx-dashboard-components` application out of a JSON configuration file.
This application is a helper to manage the JSON configuration files. The user can import a JSON configuration file and the application validates them against a JSON schema.
The application does not provide a form to create the JSON configuration file. The user has to create the JSON configuration file by hand or using a form generator. This could be included in a next version of the application.


## JSON configuration file

### Structure

The configuration file follows a JSON format with specific keys and values.
Each key represents a specific aspect of the dashboard, and its value defines its configuration.

The full schema can be found here. For more readibility, the schema has been splitted in multiple files:
- [Dashboard schema](./schema/dashboard.schema.json)
- [Dashboard text schema](./schema/dashboard-text.schema.json)
- [Visual chart schema](./schema/visual.chart.schema.json)
- [Visual map schema](./schema/visual.map.schema.json)
- [Visual value schema](./schema/visual.value.schema.json)



### How to guide

This guide will help you create a JSON configuration file to build your own personalized dashboard. 

The first level contains the following keys:
- `id`: the id of the dashboard expressed as a string. It is used to identify the dashboard in the application. (**required**)
- `rows`: the rows of the dashboard as an array. (**required**). Each row are detailed in the [Row section](#row-section).
- `languages`: the available languages of the dashboard. (**optional**). If not provided, the dashboard will be monolingual using English (`en`) as default language. [More about language](#language-section).
- `colCount`: the number of columns of the dashboard. (**optional**). If not provided, the dashboard will have 3 columns.
- `header` and `footer`: the header/footer of the dashboard (**optional**). [More about header/footer](#header-and-footer-section).

```json
{
  "id": "dashboard-id",
  "rows": [
    ...
  ],
  "languages": [
    ...
  ],
  "colCount": 6,
  "header": {
    ...
  },
  "footer": {
    ...
  }
}
```

#### Language section

The language section is an array of languages. Each language is defined by a key and a value.
The key is the language code, and the value is the language name.

```json
{
  "languages": [
    {
      "en": "English"
    },
    {
      "fr": "French"
    }
  ]
}
```

#### Row section

The rows section is an array of rows. Each row contains an array of `columns`.
Each column contains an array of `components`.

```json
{
  "rows": [
    {
      "columns": [
        {
            ...
        }
      ]
    }
  ]
}
```

In the column section, the cells of our dashboard are defined with the following attributes:
- `colSize`: the number of the column the cell takes. (**optional**). If not provided, the column will have a size of 1.
- `type`: the type of the cell. (**required**). `type` is an enum that can have the following values: [`line`, `bar`, `pie`, `column`, `value`, `drilldown`, `note`, `map`]. Note that for `note` type, only the `note` attribute is used (and `colSize` obviously), all the other following are related to chart types.
- `colorScheme`: the available color scheme only used for `map` chart types. Can be any of the following values: [`Blues`, `BrBg`, `Greens`, `Greys`, `Oranges`, `PRGn`, `PiYG`, `PuOr`, `Purples`, `RdGy`, `RdYlBu`, `RdYlGn`, `Reds`, `Spectral`, `Turbo`, `Viridis`]
- `title`: the title of the cell. (**optional**). If not provided, the cell will not have a title. The title is of type [text](#text-section).
- `subtitle`: the subtitle of the cell. (**optional**). If not provided, the cell will not have a subtitle. The subtitle is of type [text](#text-section).
- `note`: the note of the cell. (**optional**). Used only when cell is of type `note`. The note is of type [text](#text-section).  
- `frame`: indicates whether or not he cell has a border. Default value is `false` (**optional**).
- `unit`: unit displayed alongside values in charts. (**optional**). Default value is null meaning that no unit will be displayed if not specified. The unit is an object with the following attributes:
  - `text`: the unit text which is of type [text](#text-section).
  - `location`: the location of the unit in the chart (**optional**). `location` is an enum that can have the following values: [`prefix`, `suffix`, `under`]. If not provided, the unit will be located as a suffix.
- `decimals`: the number of decimals displayed in charts. (**optional**). Can be either an integer or a string pointing to a concept (eg. `DECIMALS`). If not provided, the values will be displayed the way they are rendered in the SDMX-JSON.
- `displayLabels`: whether or not to display labels in charts. (**optional**). Default value is `false`. If set to `true`, charts labels will be displayed.
- `legend`: the legend associated to the chart. (**required**). `legend` is an object with the following attributes:
  - `concept`: indicates the concept (dimension) that defines multiple series to be displayed in the visualization. For `line`, its values identify each of the lines; for `bar` or `column`, the values of this concept define each of the clusters. The legend is composed of its value labels i.e., `{$<dimension item id>}`. If several queries are included in `data` node, it should specify `MULTI`.
  In case of `drilldown` chart type, we have a multi-dimensional datasets and the `concept` value here stores the dimension used on the main chart.
  - `location`: the location of the legend in the chart (**optional**). `location` is an enum that can have the following values: [`top`, `bottom`, `left`, `right`, `none`]. If not provided, the legend will be located at the bottom.
- `xAxisConcept`: indicates the concept to be allocated to the “x” axis, usually `TIME_PERIOD` for `line`. For `bar` or `column` it indicates the dimension that define the bars. (**required** for all chart types except `value`). When used with `pie` chart type, it indicates the dimension that defines the sectors of the pie.
- `drilldown`: provides some details on how the drilled down chart should be configured, it reuses the notions of `legend` and `xAxisConcept`. In case of `drilldown.xAxisConcept` is `TIME_PERIOD`, the main chart will display for each category (`drilldown.legend.concept`) the latest value available, while the value `Total` (`_T`) will be used for other kind of dimension.
- `yAxisConcept`: indicates the concept to be allocated to the “y” axis, usually the observation value representing the `MEASURE`. (Not applicable for `pie` and `value` chart types). Normally it is the `OBS_VALUE` concept.
- `download`: indicates whether or not to display the download button. (**optional**). Default value is `false`. If set to `true`, a download button will be displayed.
- `dataLink`: An URL of an application or file containing related data. It is actionable by clicking on the chart to open in a new browser tab. (**optional**). If not provided, no link will be displayed.
- `metadataLink`: An URL of an application or file containing reference metadata. metadata. If present, a "Blue 'i'" icon is displayed besides the title, and by clicking on it the link opens in a new browser tab. (**optional**). If not provided, no link will be displayed.
- `adaptiveTextSize`: indicates whether or not to adapt the text size to the cell size for `value` chart type. Default value is `false` (**optional**).
- `colorPalette`: the color palette used in the charts. The dict should specify for each dimension the color associated to each dimension value (using the `id` as keys). The dimension is the concept that is defined as a `legend` concept. The colors are defined as hex values. (**optional**).
```json
{
  "GEO_PICT": {
    "CK": "#E16A86",
    "FJ": "#D7765B",
    "FM": "#C7821C",
    "KI": "#AF8E00",
    "MH": "#909800",
    "NC": "#65A100",
    "NR": "#00A846",
    "NU": "#00AC74",
    "PF": "#00AD9A",
    "PG": "#00AABA",
    "PW": "#00A2D3",
    "SB": "#4495E2",
    "TO": "#9183E6",
    "TV": "#BD72DD",
    "VU": "#D766C9",
    "WF": "#E264AB"
  }
}
```
- `data`: data object to describe the data displayed by the chart. Can be a string of an array of string and is **required** in all cases but chart type `note`. The syntax to specify the `data` for the chart is the following:
```json
  [
    "Dataflow query <operator> Dataflow query, <alternate label>",
    ...
    "Dataflow query <operator> Dataflow query, <alternate label>"
  ]
```
where:
  - `Dataflow query` is a valid SDMX query used to get the data to display, containing the appropriated filtering string and time period selection (using the SDMX query parameters startPeriod=, endPeriod= and lastNObservations=) for the purpose of the visualization.
  - `<alternate label>` is optional and is enclosed in curly brackets ({}). It overrides the default label and can include references to `{$<concept_Id>}`.
  - Optionally, it might be possible to compute values to be represented using the operators `+` `-` `*` `/` between the values obtained from the data queries, e.g., multiplying a result by the unit multiplier value, or computing a rate as the quotient between two levels.
  - `data` section can include a list of URLs (values or series), according to the chart characteristics.
  - in case of a `map` type chart the field `data` will have a specific syntax: 
  `SDMX_URL, {GEO_DIMENSION_ID} | GEOJSON_URL, EPSG_CODE, {GEO_ATTRIBUTE}` with: 
    - SDMX_URL : the URL to the SDMX dataset
    - GEO_DIMENSION_ID: id of the dimension holding reference to the area of application
    - GEOJSON_URL: a URL to a GeoJSON file holding the geometries
    - EPSG_CODE: the projection code (eg. 'EPSG:4326')
    - GEO_ATTRIBUTE: name of the attribute holding a reference to the geometry (value of this attribute must be equal to the SDMX dimension id value).
  - in case of a `pie` type chart the expression within `data` can use the `hist` operator to count every occurrence of a value in the dataset. The syntax is `hist(SDMX_URL)`.
  - in case of a `value` chart, the expression within `data` can use the `count` operator to count the number of observations in the dataset that match the expression. The syntax is `count(Dataflow query <operator> Value)` with operator available: `===`, `!===`.

##### Simple example of a cell definition

```json
{
  "id": "labour_force_participation",
  "colSize": 2,
  "type": "line",
  "title": {
    "text": {
      "en": "Labour Force participation rates",
      "es": "Tasas de participación en la fuerza laboral"
    },
    "size": "20px",
    "weight": "bold",
    "align": "center"
  },
  "decimals": 0,
  "labels": false,
  "legend": {
    "concept": "SEX",
    "location": "bottom"
  },
  "xAxisConcept": "TIME_PERIOD",
  "yAxisConcept": "OBS_VALUE",
  "data": "https://www.ilo.org/sdmx/rest/data/ILO,DF_EAP_DWAP_SEX_AGE_RT,1.0/CHL.A..SEX_O+SEX_F+SEX_M+SEX_T.AGE_YTHADULT_YGE15?startPeriod=2010&endPeriod=2022"
}
```

##### Examples with data expression

Value component using an expression with a multiplication operator:
```json
{
  "id": "multiple_jobs",
  "type": "value",
  "title": {
    "text": {
      "en": "Number of persons with multiple jobs",
      "es": "Número de personas con múltiples trabajos"
    },
    "size": "20",
    "weight": "bold",
    "align": "center"
  },
  "subtitle": {
    "text": "{$TIME_PERIOD}",
    "size": "13px",
    "weight": "normal",
    "style": "italic",
    "align": "center"
  },
  "labels": false,
  "data": "https://www.ilo.org/sdmx/rest/data/ILO,DF_EES_TEES_SEX_MJH_NB,1.0/CHL.A..SEX_T.MJH_AGGREGATE_MULTI?endPeriod=2022&lastNObservations=1 * {UNIT_MULT}"
}
```
Value component with a `count` operator:
```json
{
  "id": "SH_STA_MALR",
  "type": "value",
  "xAxisConcept": "GEO_PICT",
  "data": ["count(https://stats-sdmx-disseminate-staging.pacificdata.org/rest/data/DF_BP50/A.SH_STA_MALR.CK+FJ+FM+KI+MH+NC+NR+NU+PF+PG+PW+SB+TO+TV+VU+WS._T._T._T._T._T._T._Z._T?lastNObservations=1&dimensionAtObservation=AllDimensions !== 0)"],
  "unit": {
    "text": "countries",
    "location": "under"
  },
  "adaptiveTextSize": true,
  "subtitle": {
    "text": "<a href=''>Source PDH.stat</a>",
    "weight": "light",
    "size": "16px"
  }
}
```
Half-donut chart using a `hist` operator:
```json
{
  "data": ["hist(https://stats-sdmx-disseminate-staging.pacificdata.org/rest/data/DF_BP50/.SG_REG_BRTHDETH.........?lastNObservations=1&dimensionAtObservation=AllDimensions)"],
  "subtitle": {
    "text": "<a href='https://stats-staging.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_BP50&df[ag]=SPC&df[vs]=1.0&av=true&pd=2013%2C2023&lo=1&lom=LASTNOBSERVATIONS&dq=A.DC_TRF_TOTL.._T._T._T._T._T._T._Z._T&to[TIME_PERIOD]=false&ly[rs]=INDICATOR&ly[rw]=GEO_PICT%2CTIME_PERIOD'>Source PDH.stat</a>",
  },
  "id": "SG_REG_BRTHDETH",
  "type": "pie",
  "xAxisConcept": "GEO_PICT",
  "legend": {
    "concept": "INDICATOR",
    "location": "bottom"
  },
  "yAxisConcept": "OBS_VALUE",
  "extraOptions": {
    "plotOptions": {
      "pie": {
        "dataLabels": {
          "enabled": false
        },
        "startAngle": -90,
        "endAngle": 90,
        "center": ["50%", "65%"],
        "size": "140%",
        "innerSize": "50%"
      }
    },
    "tooltip": {
      "pointFormatter": "function(point) {
        return `${this.binValue === 1 ? 'Yes' : 'No'}`
      }"
    }
  }
}
```

##### Example using colorPalette

A line chart with a defined `colorPalette`
```json
{
  "data": ["https://stats-sdmx-disseminate-staging.pacificdata.org/rest/data/DF_BP50/A.DC_TRF_TOTL.CK+FJ+FM+KI+MH+NR+NU+PF+PG+PW+SB+TO+TV+VU+WS._T._T._T._T._T._T._Z._T?dimensionAtObservation=AllDimensions"],
  "id": "DC_TRF_TOTL",
  "type": "line",
  "xAxisConcept": "TIME_PERIOD",
  "legend": {
    "concept": "GEO_PICT",
    "location": "right"
  },
  "yAxisConcept": "OBS_VALUE",
  "colorPalette": {
    "GEO_PICT": {
      "CK": "#E16A86",
      "FJ": "#D7765B",
      "FM": "#C7821C",
      "KI": "#AF8E00",
      "MH": "#909800",
      "NC": "#65A100",
      "NR": "#00A846",
      "NU": "#00AC74",
      "PF": "#00AD9A",
      "PG": "#00AABA",
      "PW": "#00A2D3",
      "SB": "#4495E2",
      "TO": "#9183E6",
      "TV": "#BD72DD",
      "VU": "#D766C9",
      "WF": "#E264AB"
    }
  }
}
```
Column chart using a colorPalette:
```json
{
  "data": ["https://stats-sdmx-disseminate-staging.pacificdata.org/rest/data/DF_BP50/A.SE_ACC_HNDWSH.CK+FJ+FM+MH+NR+NU+PW+TO+TV+WS._T._T._T._T._T._T.PRIMARY_ALL+SECONDARY_LOWER+SECONDARY_UPPER._T?lastNObservations=1&dimensionAtObservation=AllDimensions"],
  "id": "SE_ACC_HNDWSH",
  "type": "column",
  "xAxisConcept": "GEO_PICT",
  "legend": {
    "concept": "COMPOSITE_BREAKDOWN",
    "location": "bottom"
  },
  "yAxisConcept": "OBS_VALUE",
  "colorPalette": {
    "COMPOSITE_BREAKDOWN": {
      "SECONDARY_LOWER": "#E16A86",
      "PRIMARY_ALL": "#50A315",
      "SECONDARY_UPPER": "#009ADE"
    }
  }
}
```

##### Example of a drilldown definition

```json
{
  "id": "household_expenditure",
  "type": "drilldown",
  "title": "Household Expenditure",
  "subtitle": "{$TIME_PERIOD}",
  "decimals": "{$DECIMALS}",
  "drilldown": {
    "legend": {
      "concept": "GEO_PICT"
    },
    "xAxisConcept": "TIME_PERIOD"
  },
  "legend": {
    "concept": "INDICATOR",
    "location": "none"
  },
  "xAxisConcept": "COMMODITY",
  "data": "https://stats-sdmx-disseminate.pacificdata.org/rest/data/SPC,DF_HHEXP,1.0/A..HHEXP._T._T.10+11+12+01+02+03+04+05+06+07+08+09+_T.USD?startPeriod=2013&endPeriod=2021&lastNObservations=1&dimensionAtObservation=AllDimensions"
}
```

##### Example of a map definition

```json
{
  "id": "inflation_rate",
  "colSize": 2,
  "colorScheme": "Greens",
  "type": "map",
  "title": "Inflation rate",
  "subtitle": "{$TIME_PERIOD}",
  "decimals": "{$DECIMALS}",
  "legend": {
    "concept": "INDICATOR",
  },
  "yAxisConcept": "OBS_VALUE",
  "data": "https://stats-sdmx-disseminate.pacificdata.org/rest/data/SPC,DF_CPI,3.0/A..INF.?startPeriod=2011&lastNObservations=1&dimensionAtObservation=AllDimensions, {GEO_PICT} | https://www.spc.int/modules/contrib/spc_dot_stat_data/modules/spc_dot_stat_map/maps/eez.json, EPSG:3832, {id}"
}
```


#### Header and Footer section

Both sections have the same characteristics. They can be defined as a string or as object with both `title` and `subtitle` as [text](#text-section) objects. Few examples shown below.

```json
{
  "header": "Header title",
  "footer": {
    "title": "Footer title",
    "subtitle": "Footer subtitle"
  }
}

...

{
  "header": {
    "title": {
      "en": "Header title",
      "fr": "Titre de l'entête"
    },
    "subtitle": "Header subtitle"
  },
  "footer": "Footer title"
}
```

#### Text section

Text sections describe both text content and style. The content can either be a string or an object with language keys and values. The style is defined by the following attributes. All attributes are optional and if not provided, the text will have the default style used on the page.
- `size`: the size of the text as in `font-size` CSS property. (**optional**).
- `weight`: the weight of the text as in `font-weight` CSS property. (**optional**).
- `align`: the alignment of the text. (**optional**). `align` is an enum that can have the following values: [`left`, `center`, `right`]
- `color`: the color of the text. (**optional**).
- `font`: the font of the text. (**optional**)
- `style`: the style of the text as in `font-style` CSS property. (**optional**).

The `text` attribute can be a string or an object with language keys and values.


```json
{
  "text": {
    "en": "Text content",
    "fr": "Contenu du texte"
  },
  "size": "1.5em",
  "style": "italic",
  "weight": "bold",
  "align": "center"
}
```
