import { useState } from 'react'
import './BoardCreationModal.css'
import { useSelector } from 'react-redux'

export default function BoardCreationModal() {
    const themes = useSelector(state => state.themes)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [theme, setTheme] = useState(themes[0].id)
    const { errors, setErrors } = useState({})

    const handleSubmit = () => {
        return
    }

    return (
        <>
            <h4>Create board</h4>
            <div className='board-preview'>PREVIEW PENDING</div>
            <form onSubmit={handleSubmit}>
                <label>
                    Background
                </label>
                <div className='board-creation-themes'>
                    {themes.map(theme => (
                        <button onClick={() => setTheme(theme.id)} key={theme.id}>
                            {theme.name}
                        </button>
                    ))}
                </div>
                {errors.theme && <span>{errors.theme}</span>}
                <label>
                    Board title
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                {errors.name && <span>{errors.name}</span>}
                <button type="submit">Create</button>
            </form>
        </>
    )
}