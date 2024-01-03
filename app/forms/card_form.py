from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class CardForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = StringField('description')
    label = StringField('label')
    image_url = StringField('image_url')