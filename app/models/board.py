from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user_boards import user_boards

class Board(db.Model):
    __tablename__ = 'boards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    theme_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("themes.id")), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String(200))
    list_order = db.Column(db.String)

    user = db.relationship("User", back_populates="boards_owner")
    lists = db.relationship("List", back_populates="board")
    theme = db.relationship("Theme", back_populates="boards_theme")


    users = db.relationship(
        "User",
        secondary=user_boards,
        back_populates="boards"
    )

    def to_dict(self, lists=False):
        dictionary = {
            'id': self.id,
            'owner_id':self.owner_id,
            'theme_id': self.theme_id,
            'name':self.name,
            'description':self.description
        }

        # if to_dict is called with Channels=True, load all channels
        if lists:
            # Add all channels to dictionary as a list of dictionaries
            dictionary['lists'] = [list.to_dict(cards = True) for list in self.lists]
            dictionary['users'] = [user.to_dict() for user in self.users]

        return dictionary