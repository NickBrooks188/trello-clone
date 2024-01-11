from app.models import db, Theme, environment, SCHEMA
from sqlalchemy.sql import text

def seed_themes():

    theme_1 = Theme(
        owner_id = 2,
        name='Tropical',
        header_color='#DDFFE8',
        gradient_left='#71FDFD',
        gradient_right='#FDF975',
        header_font_color='#172B4E'
    )

    theme_2 = Theme(
        owner_id = 2,
        name='Standard',
        header_color='#FFFED0',
        gradient_left='#FDA1A1',
        gradient_right='#FDA1A1',
        header_font_color='#172B4E'
    )
        
    theme_3 = Theme(
        owner_id = 2,
        name='Purple',
        header_color='#4033D0',
        gradient_left='#4E3DFF',
        gradient_right='#A144FF',
        header_font_color='#FFFFFF'
    )

    theme_4 = Theme(
        owner_id = 2,
        name='Blue',
        header_color='#0B5ED2',
        gradient_left='#0279FF',
        gradient_right='#093575',
        header_font_color='#FFFFFF'
    )
    
    theme_5 = Theme(
        owner_id = 2,
        name='Rainforest',
        header_color='#A7B7BB',
        background_image_url='https://images.unsplash.com/photo-1534531409543-069f6204c5b4?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFpbiUyMGZvcmVzdHxlbnwwfHwwfHx8MA%3D%3D',
        header_font_color='#172B4E'
    )

    theme_6 = Theme(
        owner_id = 2,
        name='Windows',
        header_color='#FFF7E4',
        background_image_url='https://www.pixground.com/wp-content/uploads/2023/05/Windows-11-SE-Colorful-Abstract-Background-4K-Wallpaper-1024x576.webp',
        header_font_color='#172B4E'
    )

    theme_7 = Theme(
        owner_id = 2,
        name='City',
        header_color='#021037',
        background_image_url='https://i.pinimg.com/originals/7c/30/dc/7c30dc96110d7e191f0e36e8d48c308b.jpg',
        header_font_color='#FFFFFF'
    )

    theme_8 = Theme(
        owner_id = 2,
        name='Space',
        header_color='#2F1736',
        background_image_url='https://wallpapers-clan.com/wp-content/uploads/2023/11/view-of-space-from-desolate-planet-desktop-wallpaper-preview.jpg',
        header_font_color='#FFFFFF'
    )

    
    db.session.add(theme_1)
    db.session.add(theme_2)
    db.session.add(theme_3)
    db.session.add(theme_4)
    db.session.add(theme_5)
    db.session.add(theme_6)
    db.session.add(theme_7)
    db.session.add(theme_8)
    db.session.commit()

def undo_themes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.themes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM themes"))
        
    db.session.commit()