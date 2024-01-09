from app.models import db, Theme, environment, SCHEMA
from sqlalchemy.sql import text

def seed_themes():
    theme_1 = Theme(
        owner_id = 1,
        name='Blue',
        header_color='#0279FF',
        gradient_left='#0B5ED2',
        gradient_right='#093575',
        header_font_color='#FFF'
    )

    theme_2 = Theme(
        owner_id = 1,
        name='Red',
        header_color='#D74545',
        gradient_left='#f66465',
        gradient_right='#b62425',
        header_font_color='#FFF'
    )

    theme_3 = Theme(
        owner_id = 2,
        name='Rain',
        header_color='#E9EEE8',
        background_image_url='https://images.pexels.com/photos/304875/pexels-photo-304875.jpeg?auto=compress&cs=tinysrgb&w=800',
        header_font_color='#172B4E'
    )

    db.session.add(theme_1)
    db.session.add(theme_2)
    db.session.add(theme_3)
    db.session.commit()

def undo_themes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.themes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM themes"))
        
    db.session.commit()