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
  const titleTextExpr = titleExpr.split(",")[0];
  const titleStylesExpr = titleExpr.split(",")[1];
  let titleObj: any = {};
  if (titleStylesExpr) {
    const titleStyles = titleExpr.split("[")[1].split("]")[0].split(",");
    if (titleStyles.length == 5) {
      titleObj["style"] = {
        fontType: titleStyles[0],
        fontSize: titleStyles[1],
        fontWeight: titleStyles[2],
        fontTransform: titleStyles[3],
        fontLocation: titleStyles[4],
      }
    }
  }
  let titleText = titleTextExpr;
  for (const match of titleTextExpr.matchAll(/\{\$([^{}]*)\}/g)) {
    const dim = dimensions.find((dimension: any) => dimension.id == match[1]);
    titleText = titleText.replace(match[0], dim.values[0].name);
  }
  titleObj["text"] = titleText;
  return titleObj;
}
