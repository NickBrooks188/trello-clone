from app.models import db, Card, environment, SCHEMA
from sqlalchemy.sql import text

def seed_cards():

    card_1 = Card(
        list_id=1,
        name='Write draft',
    )

    card_2 = Card(
        list_id=1,
        name='Send emails',
    )

    card_3 = Card(
        list_id=3,
        name='Check in',
    )

    card_4 = Card(
        list_id=5,
        name='Draft documents',
    )

    card_5 = Card(
        list_id=4,
        name='Review documents',
    )

    card_6 = Card(
        list_id=4,
        name='Send documents',
    )

    card_7 = Card(
        list_id=10,
        name='Outline',
    )

    card_8 = Card(
        list_id=9,
        name='Draft',
    )

    card_9 = Card(
        list_id=8,
        name='Edits',
    )

    card_10 = Card(
        list_id=7,
        name='Final version',
    )

    cards = [card_1, card_2, card_3, card_4, card_5, card_6, card_7, card_8, card_9, card_10]
    [db.session.add(card) for card in cards]
    db.session.commit()

def undo_cards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cards"))
        
    db.session.commit()