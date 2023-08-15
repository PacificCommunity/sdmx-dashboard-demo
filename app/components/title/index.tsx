import { useEffect, useState } from "react";
import { parseTextExpr } from '@/app/utils/parseTextExpr';

const Title = ({config, loadedCallback}) => {

    const [titleObject, setTitleObject] = useState(false)
    const [subTitleObject, setSubTitleObject] = useState(false)
    
    useEffect(() => {
        setTitleObject(parseTextExpr(config.Title))
        setSubTitleObject(parseTextExpr(config.Subtitle))
        loadedCallback(true)
    }, [])

    return (
        <>
            <h2>{titleObject['text']}</h2>
            { subTitleObject['text'] && (<h4>{subTitleObject['text']}</h4>) }
        </>
    )
}
export default Title