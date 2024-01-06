from .db import db, add_prefix_for_prod, environment, SCHEMA

assignments = db.Table(
    "assignments",
    db.Model.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"))),
    db.Column("card_id", db.Integer, db.ForeignKey(add_prefix_for_prod("cards.id"))),
    db.UniqueConstraint("user_id", "card_id")

)

if environment == "production":
    assignments.schema = SCHEMA