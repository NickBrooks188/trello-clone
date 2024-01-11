import { useSelector } from 'react-redux'
import './BoardTile.css'

export default function BoardTile({ board, type }) {
    const themes = useSelector(state => state.themes)

    return (
        <div className='board-tile'
            style={{
                'backgroundImage': (themes[board.theme_id]?.background_image_url
                    ? `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${themes[board.theme_id]?.background_image_url})`
                    : `linear-gradient(0.37turn, ${themes[board.theme_id]?.gradient_left} , ${themes[board.theme_id]?.gradient_right} )`),
                'backgroundSize': `cover`,
                'color': (themes[board.theme_id]?.background_image_url ? '#FFFFFF' : themes[board.theme_id].header_font_color)
            }}

        >
            <div className='board-tile-darken'>
                <div className='board-name'>{(type === 'unjoined') && (<i className="fa-solid fa-plus"></i>)}{board.name}</div>

            </div>
        </div>
    )
}