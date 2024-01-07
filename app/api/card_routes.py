from flask import Blueprint, session, request
from ..models import db, Card, User, List
from flask_login import login_required
from ..forms import CardForm, AssignmentForm
import json

card = Blueprint('card', __name__)

@card.route('<int:cardId>', methods=['PUT'])
@login_required
def update_card(cardId):
    form = CardForm()
    card = Card.query.get(cardId)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        card.name = data['name']
        card.label = data['label']
        card.description = data['description']
        card.image_url = data['image_url']
        card.list_id = data['list_id']
        db.session.commit()
        return card.to_dict()
    return {'errors': form.errors}, 401

@card.route('<int:cardId>', methods=['DELETE'])
@login_required
def delete_card(cardId):
    card = Card.query.get(cardId)
    list = List.query.get(card.list_id)
    if card and list:
        listCardsJSON = list.card_order
        listCards = json.loads(listCardsJSON)
        listCards.remove(card.id)
        newListCardsJSON = json.dumps(listCards)
        list.card_order = newListCardsJSON
        db.session.delete(card)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return  {"message": "Card Not Found"}, 404


@card.route('<int:cardId>/users', methods=['POST'])
@login_required
def add_user_to_card(cardId):
    form = AssignmentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    card = Card.query.get(cardId)
    if form.validate_on_submit() and card:
        data = form.data
        user = User.query.get(data['id'])
        card.users.append(user)
        db.session.commit()
        return card.to_dict()
    elif not card:
        return  {"message": "Board Not Found"}, 404 
    return {'errors': form.errors}, 401