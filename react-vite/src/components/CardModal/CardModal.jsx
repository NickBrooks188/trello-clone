import { useDispatch, useSelector } from "react-redux"
import { thunkAddUserToCard, thunkEditCard, thunkRemoveCard, uploadImage } from "../../redux/board"
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
    const [showNameEdit, setShowNameEdit] = useState(false)
    const [showDescriptionEdit, setShowDescriptionEdit] = useState(false)
    const [showLabelEdit, setShowLabelEdit] = useState(false)
    const [showAssignmentEdit, setShowAssignmentEdit] = useState(false)
    const [errors, setErrors] = useState({})

    const availableLabels = ['#000000', '#AAAAAA', '#FF0000', '#00FF00', '#0000FF']

    const validateName = (val) => {
        if (val.length < 28) {
            setName(val)
        }
    }

    const validateDescription = (val) => {
        if (val.length < 200) {
            setDescription(val)
        }
    }

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
                    name: name,
                    label: JSON.stringify(card.label)
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
                    description: description,
                    label: JSON.stringify(card.label)
                }, card.list_id))
                if (!serverData.errors) {
                    setShowDescriptionEdit(false)
                } else {
                    setErrors({ description: serverData.errors })
                }
                return
            }
            case 'image': {
                const formData = new FormData()
                formData.append("image", content)
                const returnImage = await dispatch(uploadImage(formData))
                if (returnImage.errors) {
                    setErrors({ image: returnImage.errors })
                    return
                }
                const serverData = await dispatch(thunkEditCard({
                    ...card,
                    label: JSON.stringify(card.label),
                    image_url: returnImage.url
                }, card.list_id))
                if (serverData.errors) {
                    setErrors({ image: serverData.errors })
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
                return
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
                <i className="fa-regular fa-hard-drive"></i>
                {((showNameEdit)) && (<form className="edit-card-name" id="edit-card-name" onSubmit={(e) => handleCardEditSubmit(e, 'name')}>
                    <input
                        id='edit-card-name-input'
                        type="text"
                        value={name}
                        onChange={e => validateName(e.target.value)}
                    />
                </form>)}
                {(!(showNameEdit)) && (<div className="card-modal-name" onClick={() => setShowNameEdit(true)}>
                    {card.name}
                </div>)}
            </div>
            {/* label */}
            <div className="card-field-wrapper">
                <div className="card-modal-labels">
                    <h2><i className="fa-solid fa-tag"></i>Labels</h2>
                    <div className="label-area">
                        {card.label && card.label.map((label) => (
                            <div className="label"
                                key={`card-${label}`}
                                style={{
                                    "backgroundColor": label
                                }}
                            >
                                <i className="fa-solid fa-trash" onClick={e => handleCardEditSubmit(e, 'label-delete', label)}
                                ></i>
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
                    <h2><i className="fa-solid fa-align-left"></i>Description</h2>
                    {((showDescriptionEdit)) && (<form className="edit-card-description" id="edit-card-description" onSubmit={(e) => handleCardEditSubmit(e, 'description')}>
                        <input
                            id='edit-card-description-input'
                            type="text"
                            value={description}
                            placeholder="Add a description..."
                            onChange={e => validateDescription(e.target.value)}
                        />
                    </form>)}
                    {(!(showDescriptionEdit)) && (<div className="card-description" onClick={() => setShowDescriptionEdit(true)}>
                        {card.description || 'Add a description...'}
                    </div>)}
                </div>
                {/* image */}
                <div className="card-modal-image">
                    <h2><i className="fa-regular fa-image"></i>Image</h2>
                    {(card.image_url) && (<img src={card.image_url} className="card-modal-image-file" />)}
                    <form>
                        <input
                            type="file"
                            accept='image/*'
                            onChange={(e) => handleCardEditSubmit(e, 'image', e.target.files[0])}
                        />
                    </form>
                </div>
                {/* assignments */}
                <div className="card-modal-assignment">
                    <h2><i className="fa-solid fa-list-check"></i>Assignments</h2>
                    <div className="assignments-wrapper">
                        {card.users && Object.values(card.users).map(assignee => (
                            <div className="assignee" key={assignee.id}>
                                <img src={assignee.profile_image_url} className="card-modal-profile-image" />{`${assignee.first_name} ${assignee.last_name}`}
                                <i className="fa-solid fa-trash"></i>
                            </div>
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
                                        <img src={user.profile_image_url} className="card-modal-profile-image" /><span>{`${user.first_name} ${user.last_name}`}</span><i className="fa-solid fa-plus"></i>
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