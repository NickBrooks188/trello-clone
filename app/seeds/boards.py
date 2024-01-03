from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text

def seed_boards():

    first_board = Board(
        owner_id=1,
        theme_id=1,
        name='My first board',
        description='Tasks for my first board',
        list_order='[1,2,3]'
    )

    second_board = Board(
        owner_id=1,
        theme_id=2,
        name='My second board',
        description='Tasks for my second board',
        list_order='[4,5,6]'
    )

    third_board = Board(
        owner_id=2,
        theme_id=3,
        name='Project board',
        description='Tasks for Nick',
        list_order='[7,8,9,10]'
    )

    db.session.add(first_board)
    db.session.add(second_board)
    db.session.add(third_board)
    db.session.commit()


def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))
        
    db.session.commit()