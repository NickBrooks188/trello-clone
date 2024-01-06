from .db import db, add_prefix_for_prod, environment, SCHEMA

user_boards = db.Table(
    "user_boards",
    db.Model.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"))),
    db.Column("board_id", db.Integer, db.ForeignKey(add_prefix_for_prod("boards.id"))),
    db.UniqueConstraint("user_id", "board_id")
)

if environment == "production":
    user_boards.schema = SCHEMA