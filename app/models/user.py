from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_boards import user_boards
from .assignment import assignments


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    profile_image_url = db.Column(db.String, default='https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/demo_user.jpeg')
    hashed_password = db.Column(db.String(255), nullable=False)

    themes_owner = db.relationship("Theme", back_populates="user")
    boards_owner = db.relationship("Board", back_populates="user")

    boards = db.relationship(
        "Board",
        secondary=user_boards,
        back_populates="users"
    )

    cards = db.relationship(
        "Card",
        secondary=assignments,
        back_populates="users"
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'location': self.location,
            'profile_image_url': self.profile_image_url
        }
