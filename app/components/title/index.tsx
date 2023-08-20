import { useEffect, useState } from "react";
import { parseTextExpr } from '@/app/utils/parseTextExpr';

const Title = ({ config, loadedCallback }) => {

    const [titleObject, setTitleObject] = useState({ text: "Loading..." })
    const [subTitleObject, setSubTitleObject] = useState({ text: "Loading..." })

    useEffect(() => {
        const titleObj = parseTextExpr(config.Title)
        setTitleObject(titleObj)
        setSubTitleObject(parseTextExpr(config.Subtitle))
        loadedCallback(true)
    }, [])

    return (
        <>
            <h2 className={`${titleObject.bootstrapcss && titleObject.bootstrapcss.join(' ')} pt-3`} style={titleObject.inlinecss}>{titleObject.text}</h2>
            {subTitleObject['text'] && (<h4 className={`${subTitleObject.bootstrapcss && subTitleObject.bootstrapcss.join(' ')} pb-2`} style={subTitleObject.inlinecss}>{subTitleObject.text}</h4>)}
        </>
    )
}
export default Title