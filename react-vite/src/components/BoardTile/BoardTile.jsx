import { useSelector } from 'react-redux'
import './BoardTile.css'

export default function BoardTile({ board }) {
    const themes = useSelector(state => state.themes)

    return (
        <div className='board-tile'
            style={{
                'background': (themes[board.theme_id]?.background_image_url
                    ? `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${themes[board.theme_id]?.background_image_url})`
                    : `linear-gradient(0.37turn, ${themes[board.theme_id]?.gradient_left} , ${themes[board.theme_id]?.gradient_right} )`),
                'backgroundSize': `cover`
            }}

        ><div className='board-name'>{board.name}</div>             <div className='home-darken'></div>
        </div>
    )
}