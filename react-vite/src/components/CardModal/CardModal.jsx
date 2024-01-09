import { useDispatch, useSelector } from "react-redux"
import { thunkAddUserToCard, thunkEditCard, thunkRemoveCard } from "../../redux/board"
import { useModal } from "../../context/Modal"
import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import './CardModal.css'

export default function CardModal({ card }) {
    const dispatch = useDispatch()
    const board = useSelector(state => state.board)
    const { closeModal } = useModal()
    const [name, setName] = useState(card.name)
    const [description, setDescription] = useState(card.description || '')
    const [label, setLabel] = useState(card.label || '')
    const [image_url, setImage_url] = useState(card.image_url || '')
    const [showNameEdit, setShowNameEdit] = useState(false)
    const [showDescriptionEdit, setShowDescriptionEdit] = useState(false)
    const [showLabelEdit, setShowLabelEdit] = useState(false)
    const [showAssignmentEdit, setShowAssignmentEdit] = useState(false)
    const [errors, setErrors] = useState({})

    const availableLabels = ['#000000', '#AAAAAA', '#FF0000', '#00FF00', '#0000FF']

    const handleCardDelete = async () => {
        const serverData = await dispatch(thunkRemoveCard(card.id, card.list_id))
        if (!serverData.errors) {
            closeModal()
        }
    }

    const handleCardEditSubmit = async (e, type, content) => {
        e.preventDefault()
        switch (type) {
            case 'name': {
                const serverData = await dispatch(thunkEditCard({
                    ...card,
                    name: name
                }, card.list_id))
                if (!serverData.errors) {
                    setShowNameEdit(false)
                } else {
                    setErrors({ name: serverData.errors })
                }
                return
            }
            case 'label': {
                let cardLabels = card.label || []
                cardLabels.push(content)
                const serverData = await dispatch(thunkEditCard({
                    ...card,
                    label: JSON.stringify(cardLabels)
                }, card.list_id))
                if (!serverData.errors) {
                    setShowLabelEdit(false)
                } else {
                    setErrors({ label: serverData.errors })
                }
                return
            }
            case 'label-delete': {
                let cardLabels = card.label
                const index = cardLabels.indexOf(content)
                cardLabels.splice(index, 1)
                const serverData = await dispatch(thunkEditCard({
                    ...card,
                    label: JSON.stringify(cardLabels)
                }, card.list_id))
                if (!serverData.errors) {
                    setShowLabelEdit(false)
                } else {
                    setErrors({ label: serverData.errors })
                }
                return
            }
            case 'description': {
                if (!description) {
                    setShowDescriptionEdit(false)
                    return
                }
                const serverData = await dispatch(thunkEditCard({
                    ...card,
                    description: description
                }, card.list_id))
                if (!serverData.errors) {
                    setShowDescriptionEdit(false)
                } else {
                    setErrors({ description: serverData.errors })
                }
                return
            }
            case 'user': {
                const serverData = await dispatch(thunkAddUserToCard(content, card.list_id, card.id))
                if (!serverData.errors) {
                    setShowAssignmentEdit(false)
                } else {
                    setErrors({ assignment: serverData.errors })
                }
            }
        }
        return
    }

    useEffect(() => {
        if (document.getElementById('edit-card-name-input')) {
            document.getElementById('edit-card-name-input').focus()
        } else if (document.getElementById('edit-card-description-input')) {
            document.getElementById('edit-card-description-input').focus()
        }
    }, [showNameEdit, showDescriptionEdit])


    return (
        <div className="card-modal-wrapper">
            <div className='close-modal-x' onClick={closeModal}><i className="fa-solid fa-xmark"></i></div>
            <div className="card-modal-name">
                {((showNameEdit)) && (<form className="edit-card-name" id="edit-card-name" onSubmit={(e) => handleCardEditSubmit(e, 'name')}>
                    <input
                        id='edit-card-name-input'
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </form>)}
                {(!(showNameEdit)) && (<div className="card-name" onClick={() => setShowNameEdit(true)}>
                    {card.name}
                </div>)}
            </div>
            {/* label */}
            <div className="card-field-wrapper">
                <div className="card-modal-labels">
                    <h2>Labels</h2>
                    <div className="label-area">
                        {card.label && card.label.map((label) => (
                            <div className="label"
                                key={`card-${label}`}
                                style={{
                                    "backgroundColor": label
                                }}
                                onClick={e => handleCardEditSubmit(e, 'label-delete', label)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </div>
                        ))}
                        <button className="add-label" onClick={() => setShowLabelEdit(true)}><i className="fa-solid fa-plus"></i></button>
                    </div>
                    {(showLabelEdit) && (
                        <div className="label-popup">
                            <div className='close-modal-x' onClick={() => setShowLabelEdit(false)}><i className="fa-solid fa-xmark"></i></div>

                            <h2>Add a label</h2>
                            <div className="available-labels-wrapper">
                                {availableLabels.map((label) => ((card.label.indexOf(label) == -1) && (
                                    <button className="available-label" onClick={(e) => handleCardEditSubmit(e, 'label', label)} key={label} style={{
                                        'backgroundColor': label
                                    }}>
                                        <i className="fa-solid fa-plus"></i>
                                    </button>)
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* description */}
                <div className="card-modal-description">
                    <h2>Description</h2>
                    {((showDescriptionEdit)) && (<form className="edit-card-description" id="edit-card-description" onSubmit={(e) => handleCardEditSubmit(e, 'description')}>
                        <input
                            id='edit-card-description-input'
                            type="text"
                            value={description}
                            placeholder="Add a description..."
                            onChange={e => setDescription(e.target.value)}
                        />
                    </form>)}
                    {(!(showDescriptionEdit)) && (<div className="card-description" onClick={() => setShowDescriptionEdit(true)}>
                        {card.description || 'Add a description...'}
                    </div>)}
                </div>
                {/* image */}
                <div className="card-modal-image">
                    <h2>Image</h2>
                    <img src={card.image_url} />
                </div>
                {/* assignments */}
                <div className="card-modal-assignment">
                    <h2>Assignments</h2>
                    <div className="assignments-wrapper">
                        {card.users && Object.values(card.users).map(assignee => (
                            <div className="assignee" key={assignee.id}>{`${assignee.first_name} ${assignee.last_name}`}</div>
                        ))}
                        <button className="add-assignment" onClick={() => setShowAssignmentEdit(true)}><i className="fa-solid fa-plus"></i></button>

                    </div>
                    {(showAssignmentEdit) && (
                        <div className="assignment-popup">
                            <div className='close-modal-x' onClick={() => setShowAssignmentEdit(false)}><i className="fa-solid fa-xmark"></i></div>

                            <h2>Add assignee</h2>
                            <div className="available-users-wrapper">
                                {(Object.values(board.users)).map((user) => ((!card.users[user.id]) && (
                                    <button className="available-user" key={user.id} onClick={(e) => handleCardEditSubmit(e, "user", user)}>
                                        {`${user.first_name} ${user.last_name}`}<i className="fa-solid fa-plus"></i>
                                    </button>)
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button className="card-modal-delete-button" onClick={handleCardDelete}>Delete card</button>
            {(showNameEdit) && (<div className="cover-everything" onClick={(e) => handleCardEditSubmit(e, 'name')} />)}
            {(showDescriptionEdit) && (<div className="cover-everything" onClick={(e) => handleCardEditSubmit(e, 'description')} />)}
            {(showLabelEdit) && (<div className="cover-everything" onClick={() => setShowLabelEdit(false)} />)}
            {(showAssignmentEdit) && (<div className="cover-everything" onClick={() => setShowAssignmentEdit(false)} />)}

        </div>
    )
}