export default function CardModal({ card }) {
    return (
        <div className="card-modal-wrapper">
            <div className="card-modal-name">{card.name}</div>
            <div className="card-modal-labels">{card.label}</div>
            <div className="card-modal-description">{card.description}</div>
            <button className="card-modal-delete-button">Delete card</button>
        </div>
    )
}