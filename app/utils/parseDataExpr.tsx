import { type } from "os";

/**
 * Process the "DATA" expression provided in yaml.
 * Example: 'https://www.ilo.org/sdmx/rest/data/ILO,DF_EES_TEES_SEX_MJH_NB,1.0/CHL.A..SEX_T.MJH_AGGREGATE_MULTI?endPeriod=2022&lastNObservations=1 * {UNIT_MULT}',
 * 
 * @todo Review style parsing method as it is not limited to 5 params only:
 *   Font type, size, emphasis (bold, italics, etc.) and location (LEFT, CENTER, RIGHT)
 *   can be specified in square-brackets ([]) following any text, title, note or label specification. 
 * @todo What is DIN param ? (can not find info in requirements, just ignore for now)
 * @todo fix variable params e.g. {$TIME_PERIOD}
 * 
 * @param {String} dataExpr
 * @returns {Object}
 */
export const parseDataExpr = (dataExprs: [string]) => {

  if(typeof dataExprs === 'string') {
    dataExprs = [dataExprs];
  }

  // define return object
  let results : any[] = [];

  dataExprs.forEach((dataExpr: string) => {
    let parsedExpr : any = {
      'dataFlowUrl': [],
    };

    const tokens = dataExpr.split(' ');
    if (tokens.length == 1) {
      parsedExpr['dataFlowUrl'] = tokens[0].trim();
    } else {
      parsedExpr['dataFlowUrl'].push(tokens[0].trim());
      parsedExpr['operator'] = tokens[1];
      parsedExpr['operand'] = tokens[2];
    }
    
    results.push(parsedExpr);
  });

  return results;

}
