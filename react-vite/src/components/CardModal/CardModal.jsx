import { useDispatch } from "react-redux"
import { thunkRemoveCard } from "../../redux/board"
import { useModal } from "../../context/Modal"

export default function CardModal({ card }) {
    const dispatch = useDispatch()

    const { closeModal } = useModal()

    const handleCardDelete = async () => {
        const serverData = await dispatch(thunkRemoveCard(card.id, card.list_id))
        if (!serverData.errors) {
            closeModal()
        }
    }

    return (
        <div className="card-modal-wrapper">
            <div className="card-modal-name">{card.name}</div>
            <div className="card-modal-labels">{card.label}</div>
            <div className="card-modal-description">{card.description}</div>
            <button className="card-modal-delete-button" onClick={handleCardDelete}>Delete card</button>
        </div>
    )
}