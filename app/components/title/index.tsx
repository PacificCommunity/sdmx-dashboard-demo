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
        <div className="pt-3 pb-2 px-2 px-xl-3 bg-white">
            <h2 className={`${titleObject.bootstrapcss && titleObject.bootstrapcss.join(' ')}`} style={titleObject.inlinecss}>{titleObject.text}</h2>
            {subTitleObject['text'] && (<h4 className={`${subTitleObject.bootstrapcss && subTitleObject.bootstrapcss.join(' ')}`} style={subTitleObject.inlinecss}>{subTitleObject.text}</h4>)}
        </div>
    )
}
export default Title