from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text
from .users import demo, nick, other

def seed_boards():

    board_1 = Board(
        owner_id=1,
        theme_id=1,
        name='My first board',
        description='Tasks for my first board',
        list_order='[1,2,3]'
    )

    board_2 = Board(
        owner_id=1,
        theme_id=2,
        name='My second board',
        description='Tasks for my second board',
        list_order='[4,5,6]'
    )

    board_3 = Board(
        owner_id=2,
        theme_id=7,
        name='Project board',
        description='Tasks for Nick',
        list_order='[7,8,9,10]'
    )

    board_4 = Board(
        owner_id=2,
        theme_id=5,
        name='Night board',
        description='Tasks for after dark',
        list_order='[]'
    )

    board_1.users.append(demo)
    board_2.users.append(demo)
    board_3.users.append(nick)
    board_4.users.append(nick)


    db.session.add(board_1)
    db.session.add(board_2)
    db.session.add(board_3)
    db.session.add(board_4)
    db.session.commit()


def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))
        
    db.session.commit()