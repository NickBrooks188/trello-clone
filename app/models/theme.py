from .db import db, environment, SCHEMA, add_prefix_for_prod

class Theme(db.Model):
    __tablename__ = 'themes'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")))
    name = db.Column(db.String, nullable=False)
    header_color = db.Column(db.String, nullable=False)
    gradient_left = db.Column(db.String)
    gradient_right = db.Column(db.String)
    background_image_url = db.Column(db.String)
    header_font_color = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="themes_owner")
    boards = db.relationship("Board", back_populates="theme")

    def to_dict(self):
        dictionary = {
            'id': self.id,
            'owner_id':self.owner_id,
            'name':self.name,
            'header_color':self.header_color,
            'gradient_left':self.gradient_left,
            'gradient_right':self.gradient_right,
            'background_image_url':self.background_image_url,
            'header_font_color':self.header_font_color
        }

        return dictionary