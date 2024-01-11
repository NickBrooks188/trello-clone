from app.models import db, Card, environment, SCHEMA
from sqlalchemy.sql import text

def seed_cards():

    card_1 = Card(
        list_id=1,
        name='Write draft',
        label='[#EF946A]'
    )

    card_2 = Card(
        list_id=1,
        name='Send emails',
        description='Send 5 remaining emails'
    )

    card_3 = Card(
        list_id=3,
        name='Check in',
    )

    card_4 = Card(
        list_id=4,
        name='Draft documents',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Purple-Todo.svg'
    )

    card_5 = Card(
        list_id=5,
        name='Review documents',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Purple-InProgress.svg'
    )

    card_6 = Card(
        list_id=6,
        name='Send documents',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Purple-InReview.svg'
    )

    card_7 = Card(
        list_id=7,
        name='Setup documents',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Purple-Complete.svg'
    )

    card_8 = Card(
        list_id=11,
        name='Complete',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Tropical-Complete%402x.png'
    )

    card_9 = Card(
        list_id=10,
        name='In progress',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Tropical-InProgress%402x.png'
    )

    card_10 = Card(
        list_id=9,
        name='Next tasks',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Tropical-NextTasks%402x.png'
    )

    card_11 = Card(
        list_id=8,
        name='Todo',
        image_url='https://jello-bucket.s3.us-west-1.amazonaws.com/Tropical-Todo%402x.png'
    )

    cards = [card_1, card_2, card_3, card_4, card_5, card_6, card_7, card_8, card_9, card_10, card_11]
    [db.session.add(card) for card in cards]
    db.session.commit()

def undo_cards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cards"))
        
    db.session.commit()