from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired

class AssignmentForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired()])
