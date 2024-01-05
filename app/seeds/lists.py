from app.models import db, List, environment, SCHEMA
from sqlalchemy.sql import text

def seed_lists():
    list_1 = List(
        board_id = 1,
        name='Todo',
        card_order='[1,2]'
    )

    list_2 = List(
        board_id = 1,
        name='In progress'
    )

    list_3 = List(
        board_id = 1,
        name='Done',
        card_order='[3]'
    )

    list_4 = List(
        board_id = 2,
        name='Todo',
        card_order='[5,6]'
    )

    list_5 = List(
        board_id = 2,
        name='In progress',
        card_order='[4]'
    )

    list_6 = List(
        board_id = 2,
        name='Done'
    )

    list_7 = List(
        board_id = 3,
        name='Todo',
        card_order='[10]'
    )

    list_8 = List(
        board_id = 3,
        name='In progress',
        card_order='[9]'
    )

    list_9 = List(
        board_id = 3,
        name='In review',
        card_order='[8]'
    )

    list_10 = List(
        board_id = 3,
        name='Done',
        card_order='[7]'
    )

    lists = [list_1, list_2, list_3, list_4, list_5, list_6, list_7, list_8, list_9, list_10]
    [db.session.add(list) for list in lists]
    db.session.commit()

def undo_lists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.lists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM lists"))
        
    db.session.commit()