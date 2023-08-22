/**
 * Process the "Title" expression provided in yaml.
 * Example: 'Status in employment {$TIME_PERIOD}, [DIN, 14, Bold, Italics, LEFT]',
 * 
 * @todo Review style parsing method as it is not limited to 5 params only:
 *   Font type, size, emphasis (bold, italics, etc.) and location (LEFT, CENTER, RIGHT)
 *   can be specified in square-brackets ([]) following any text, title, note or label specification. 
 * @todo What is DIN param ? (can not find info in requirements, just ignore for now)
 * @todo fix variable params e.g. {$TIME_PERIOD}
 * 
 * @param {String} titleExpr
 * @param {Object} dimensions
 * @returns {Object}
 */
export const parseTextExpr = (titleExpr: string, dimensions: any) => {

  // define return object
  let result = {
    text: '',         // cleaned up and parsed text
    bootstrapcss: [], // bootstrap classname used in title component
    inlinecss: {},    // inline css used in title component (font-size)
    align: 'center',  // alignment for highcharts
    hcStyle: {}       // highcharts style
  }

  if (!titleExpr || !titleExpr.trim()) {
    return result;
  }

  // clean up title
  const text = titleExpr.replace(/,[\s]?\[(.*?)\]$/, '').trim()
  // replace {$VARIABLE} with actual value
  // @todo it is not as simple as that
  // see console.log(text, dimensions);
  const textWithValues = text.replace(/\{\$(.*?)\}/g, (match, p1) => {
    return dimensions[p1] || match;
  });

  result.text = textWithValues;  

  // Get style options
  // Match coma separated values in square brackets from a string
  const match = titleExpr.match(/,[\s]?\[(.*?)\]$/);
  const style = match ? match[0].replace(/\[|\]/g, '').split(',') : [];

  // fill in result object
  style.forEach((item) => {
    switch (item.trim().toLowerCase()) {
      case 'bold':
        result.bootstrapcss.push('fw-bold');
        result.hcStyle.fontWeight = 'bold';
        break;
      case 'italics':
        result.bootstrapcss.push('fst-italic');
        result.hcStyle.fontStyle = 'italic';
        break;
      case 'left':
        result.bootstrapcss.push('text-start');
        result.align = 'left';
        break;
      case 'center':
        result.bootstrapcss.push('text-center');
        result.align = 'center';
        break;
      case 'right':
        result.bootstrapcss.push('text-end');
        result.align = 'right';
        break;
      default:
        // if number, then it is font size
        if (parseInt(item)) {
          result.inlinecss.fontSize = `${parseInt(item)}px`;
          result.hcStyle.fontSize = `${parseInt(item)}px`;
        } else {
          // ignore other params
        }
        break;
    }
  });

  return result;

}
