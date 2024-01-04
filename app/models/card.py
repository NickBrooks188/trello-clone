from .db import db, environment, SCHEMA, add_prefix_for_prod
from .assignment import assignments

class Card(db.Model):
    __tablename__ = 'cards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lists.id")))
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    label = db.Column(db.String)
    image_url = db.Column(db.String)

    list = db.relationship("List", back_populates="cards")

    users = db.relationship(
        "User",
        secondary=assignments,
        back_populates="cards"
    )

    def to_dict(self):
        dictionary = {
            'id': self.id,
            'list_id':self.list_id,
            'name':self.name,
            'description':self.description,
            'label':self.label,
            'image_url':self.image_url
        }
        dictionary['users'] = [user.to_dict() for user in self.users]

        return dictionary