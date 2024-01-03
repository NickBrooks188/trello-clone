from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired

class BoardForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    theme_id = IntegerField('theme_id', validators=[DataRequired()])
    description = StringField('description')
