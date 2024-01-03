from .db import db, environment, SCHEMA, add_prefix_for_prod

class List(db.Model):
    __tablename__ = 'lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id")))
    name = db.Column(db.String, nullable=False)

    cards = db.relationship("Card", back_populates="list")
    board = db.relationship("Board", back_populates="lists")

    def to_dict(self, cards=False):
        dictionary = {
            'id': self.id,
            'board_id':self.board_id,
            'name':self.name,

        }

        # if messages=True, add amount of messages equal to 'limit' to dictionary.
        if cards:
            # runs sorting lambda that sorts by Year, Month, Day, Hour, Minute, Second and adds list of messages to the dictionary
            dictionary['cards'] = [card.to_dict() for card in self.cards]

        return dictionary