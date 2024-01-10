from flask import Blueprint, request
from ..models import db
from flask_login import current_user, login_required
from ..forms import ImageForm
from .aws import (
    upload_file_to_s3, get_unique_filename, remove_file_from_s3)

image_routes = Blueprint("images", __name__)


@image_routes.route("", methods=["POST"])
def upload_image():
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print('~~~~~~~~~~~~~~', form.data)
    if form.validate_on_submit():
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when we tried to upload
        # so we send back that error message (and we printed it above)
            return {"errors":[upload]}, 401

        url = upload["url"]
        return {"url": url}

    return {"errors": form.errors}, 401

@image_routes.route("images/<image_url>", methods=["DELETE"])
def delete_image(image_url):
    removed = remove_file_from_s3(image_url)
    return {"removed": removed}