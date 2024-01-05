from flask import Blueprint, session, request
from ..models import db, Board, List, User
from flask_login import login_required
from ..forms import BoardForm, ListForm, UserBoardForm
import json

board = Blueprint('board', __name__)

@board.route('', methods=['GET'])
@login_required
def get_all_boards():
    boards = Board.query.all()
    return {board.id: board.to_dict() for board in boards}

@board.route('', methods=['POST'])
@login_required
def create_board():
    form = BoardForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_board = Board(
            owner_id = int(session['_user_id']),
            name = data['name'],
            theme_id = data['theme_id'],
            description = data['description']
        )
        user = User.query.get(int(session['_user_id']))
        new_board.users.append(user)
        db.session.add(new_board)
        db.session.commit()
        return new_board.to_dict()
    return {'errors': form.errors}, 401


@board.route('/<int:boardId>', methods=['GET'])
@login_required
def get_all_board_info(boardId):
    board = Board.query.get(boardId)

    if (board):
        return board.to_dict(lists=True)
    
    return  {"message": "Board Not Found"}, 404


@board.route('/<int:boardId>', methods=["PUT"])
@login_required
def update_board(boardId):
    form = BoardForm()
    board = Board.query.get(boardId)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit() and int(session['_user_id']) == board.to_dict()['owner_id']:
        data = form.data
        board.name = data['name']
        board.description = data['description']
        board.theme_id = data['theme_id']
        board.list_order = data['list_order']
        db.session.commit()
        return board.to_dict(lists=True)
    elif not form.validate_on_submit():
        return {'errors': form.errors}, 401
    return {'errors': {'message': 'Unauthorized'}}, 403


@board.route('/<int:boardId>', methods=["DELETE"])
@login_required
def delete_board(boardId):
    board = Board.query.get(boardId)
    if board and int(session['_user_id']) == board.to_dict()['owner_id']:
        db.session.delete(board)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403


@board.route('<int:boardId>/lists', methods=["POST"])
@login_required
def create_list(boardId):
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_list = List(
            name = data['name'],
            board_id = int(boardId),
        )
        db.session.add(new_list)
        board = Board.query.get(boardId)
        boardListsJSON = board.list_order
        boardLists = json.loads(boardListsJSON)
        boardLists.append(new_list.id)
        newBoardListsJSON = json.dumps(boardLists)
        board.list_order = newBoardListsJSON
        db.session.commit()
        return new_list.to_dict()
    return {'errors': form.errors}, 401

@board.route('<int:boardId>/users', methods=["POST"])
@login_required
def add_user_to_board(boardId):
    form = UserBoardForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    board = Board.query.get(boardId)
    if form.validate_on_submit() and board:
        data = form.data
        user = User.query.get(data['id'])
        board.users.append(user)
        db.session.commit()
        return board.to_dict()
    elif not board:
        return  {"message": "Board Not Found"}, 404 
    return {'errors': form.errors}, 401