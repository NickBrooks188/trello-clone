from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired

class BoardForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    theme_id = IntegerField('theme_id', validators=[DataRequired()])
    description = StringField('description')
    list_order = StringField('list_order')
    public = BooleanField('public')
