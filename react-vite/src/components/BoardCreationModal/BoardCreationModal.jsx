import { useEffect, useState } from 'react'
import './BoardCreationModal.css'
import { useDispatch, useSelector } from 'react-redux'
import TextareaAutosize from "react-textarea-autosize";
import { thunkAddBoard } from '../../redux/board';
import { useNavigate } from 'react-router-dom';
import { useModal } from "../../context/Modal";


export default function BoardCreationModal() {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const themes = useSelector(state => state.themes)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [theme, setTheme] = useState(Object.values(themes)[0]?.id)
    const [errors, setErrors] = useState({})
    const [disabled, setDisabled] = useState(true)


    const validateName = (val) => {
        setName(val)
        let errorsTemp
        (val.length < 5) ? errorsTemp = { ...errors, name: "Name must be at least 5 characters long" } : errorsTemp = { ...errors, name: null }
        setErrors(errorsTemp)
    }

    useEffect(() => {
        if (name && theme && !(errors.name) && !(errors.theme) && !(errors.description)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [name, theme, errors, setDisabled])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (disabled) return

        const serverResponse = await dispatch(
            thunkAddBoard({
                name,
                description: (description || null),
                theme_id: theme
            })
        )

        if (serverResponse.errors) {
            setErrors(serverResponse)
        } else {
            closeModal()
        }
    }

    const clickTheme = (e) => {
        e.preventDefault()
        setTheme(Number(e.target.value))
    }

    if (!themes) return null

    return (
        <>
            <h4>Create board</h4>
            <div className='board-preview'>PREVIEW PENDING</div>
            <form onSubmit={handleSubmit}>
                <label>
                    Background
                </label>
                <div className='board-creation-themes'>
                    {Object.values(themes).map(theme => (
                        <button onClick={(e) => clickTheme(e)} key={theme.id} value={theme.id}>
                            {theme.name}
                        </button>
                    ))}
                </div>
                {errors?.theme && <span>{errors?.theme}</span>}
                <label>
                    Board title
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => validateName(e.target.value)}
                    />
                </label>
                {errors?.name && <span>{errors?.name}</span>}
                <label>
                    Board description
                    <TextareaAutosize
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                {errors?.description && <span>{errors?.description}</span>}
                <button type="submit" disabled={disabled}>Create</button>
            </form>
        </>
    )
}