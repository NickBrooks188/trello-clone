from flask import Blueprint, session, request
from ..models import db, List, Card
from flask_login import login_required
from ..forms import ListForm, CardForm
import json

list = Blueprint('list', __name__)

@list.route('<int:listId>', methods=["PUT"])
@login_required
def update_list(listId):
    form = ListForm()
    list = List.query.get(listId)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        list.name = data['name']
        list.card_order = data['card_order']
        db.session.commit()
        return list.to_dict(cards=True)
    elif not form.validate_on_submit():
        return {'errors': form.errors}, 401
    return {'errors': {'message': 'Unauthorized'}}, 403

@list.route('<int:listId>', methods=["DELETE"])
@login_required
def delete_list(listId):
    list = List.query.get(listId)
    if list:
        db.session.delete(list)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return  {"message": "List Not Found"}, 404

@list.route('<int:listId>/cards', methods=["POST"])
@login_required
def create_card(listId):
    list = List.query.get(listId)
    form = CardForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit() and list:
        data = form.data
        new_card = Card(
            name = data['name'],
            list_id = int(listId)
        )
        db.session.add(new_card)
        listCardsJSON = list.card_order
        listCards = json.loads(listCardsJSON)
        listCards.append(new_card.id)
        newListCardsJSON = json.dumps(listCards)
        list.card_order = newListCardsJSON
        db.session.commit()
        return new_card.to_dict()
    return {'errors': form.errors}, 401
