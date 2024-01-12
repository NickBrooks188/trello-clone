import { useEffect, useState } from 'react'
import './BoardModal.css'
import { useDispatch, useSelector } from 'react-redux'
import TextareaAutosize from "react-textarea-autosize";
import { thunkAddBoard, thunkEditBoard, thunkRemoveBoard } from '../../redux/board';
import { useNavigate } from 'react-router-dom';
import { useModal } from "../../context/Modal";


export default function BoardModal({ type }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { closeModal } = useModal();
    const board = useSelector(state => state.board)
    const themes = useSelector(state => state.themes)
    const sessionUser = useSelector(state => state.session.user)
    const [name, setName] = useState((type === "Edit" ? board.name : ""))
    const [description, setDescription] = useState((type === "Edit" ? (board.description || "") : ""))
    const [publicVisible, setPublicVisible] = useState((type === "Edit" ? (board.public) : true))
    const [themeId, setThemeId] = useState((type === "Edit" ? board.theme_id : Object.values(themes)[0]?.id))
    const [errors, setErrors] = useState({})
    const [disabled, setDisabled] = useState(true)

    console.log(board.public)

    const validateName = (val) => {
        if (val.length < 30) {
            setName(val)
        }
        let errorsTemp
        (val.length < 5) ? errorsTemp = { ...errors, name: "Name must be at least 5 characters long" } : errorsTemp = { ...errors, name: null }
        setErrors(errorsTemp)
    }

    const validateDescription = (val) => {
        if (val.length < 200) {
            setDescription(val)
        }
    }

    const validatePublic = (e, val) => {
        e.preventDefault()
        setPublicVisible(val)
    }

    useEffect(() => {
        if (name && themeId && !(errors.name) && !(errors.themeId) && !(errors.description)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [name, themeId, errors, setDisabled])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (disabled) return

        if (type === "Create") {
            const serverResponse = await dispatch(
                thunkAddBoard({
                    name,
                    description: (description || null),
                    public: publicVisible,
                    theme_id: themeId
                })
            )

            if (serverResponse.errors) {
                setErrors(serverResponse)
            } else {
                closeModal()
            }
        } else if (type === "Edit") {
            const serverResponse = await dispatch(
                thunkEditBoard({
                    ...board,
                    name,
                    description: (description || null),
                    theme_id: themeId,
                    public: publicVisible,
                    list_order: JSON.stringify(board.list_order)
                })
            )
            if (serverResponse.errors) {
                setErrors(serverResponse)
            } else {
                closeModal()
            }
        }

    }

    const clickTheme = (e) => {
        e.preventDefault()
        setThemeId(Number(e.target.parentElement.value))
    }

    const deleteBoard = async () => {
        const serverResponse = await dispatch(thunkRemoveBoard(board.id))
        if (serverResponse.errors) {
            setErrors(serverResponse)
        } else {
            navigate('/home')
            closeModal()
        }
    }

    if (!themes) return null

    return (
        <div className='board-modal-wrapper'>
            <div className='close-modal-x' onClick={closeModal}><i className="fa-solid fa-xmark"></i></div>
            <div className='board-modal-header'>{type} board</div>
            <div className='board-preview'
                style={{
                    'backgroundImage': (themes[themeId]?.background_image_url ? `url(${themes[themeId]?.background_image_url})` : `linear-gradient(0.37turn, ${themes[themeId]?.gradient_left} , ${themes[themeId]?.gradient_right} )`),
                    'backgroundSize': `cover`
                }}
            ><img src='https://jello-bucket.s3.us-west-1.amazonaws.com/BoardTemplateUpdate.svg' /></div>
            <form onSubmit={handleSubmit} className='board-modal-form'>
                <label>
                    Background
                </label>
                <div className='board-creation-themes'>
                    {Object.values(themes).map(theme => (
                        <button
                            className='theme-select-button'
                            onClick={(e) => clickTheme(e)}
                            key={theme.id}
                            value={theme.id}
                            title={theme.name}
                            style={{
                                'backgroundImage': (theme?.background_image_url ? `url(${theme?.background_image_url})` : `linear-gradient(0.37turn, ${theme.gradient_left} , ${theme.gradient_right} )`),
                                'backgroundSize': `cover`
                            }}>
                            <div className='darken' />
                        </button>
                    ))}
                </div>
                <p>{errors?.theme}</p>
                <label>
                    <div className='board-title-wrapper'>Board title <div className='asterisk'>*</div></div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => validateName(e.target.value)}
                    />
                </label>
                <p>{errors?.name}</p>
                Board visibility
                <label>
                    <div className='board-visibility-wrapper'>
                        <button title='Anyone can see this board' className={`public${publicVisible ? ' public-active' : ''}`} onClick={(e) => validatePublic(e, true)}><span>Public</span></button>
                        <button title='Only board members can see this board' className={`private${!publicVisible ? ' public-active' : ''}`} onClick={(e) => validatePublic(e, false)}><span>Private</span></button>
                    </div>
                </label>
                <p>{errors?.publicVisible}</p>
                <label>
                    Board description
                    <TextareaAutosize
                        type="text"
                        value={description}
                        onChange={(e) => validateDescription(e.target.value)}
                    />
                </label>
                <p>{errors?.description}</p>
                <button type="submit" className='board-modal-submit' disabled={disabled}>{type}</button>
            </form>
            {(type === 'Edit' && sessionUser.id == board.owner_id) && (
                <button className='delete-board' onClick={deleteBoard}>Delete</button>
            )}
        </div>
    )
}