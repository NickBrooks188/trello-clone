from flask import Blueprint, session, request
from ..models import db, Theme
from flask_login import login_required

theme = Blueprint('theme', __name__)

@theme.route('', methods=['GET'])
@login_required
def get_all_themes():
    themes = Theme.query.all()
    return { theme.to_dict()['id']: theme.to_dict() for theme in themes }
