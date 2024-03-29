from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class ListForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    card_order = StringField('card_order')
