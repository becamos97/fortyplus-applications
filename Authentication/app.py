from flask import Flask, render_template, redirect, session, flash, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from forms import RegisterForm, LoginForm, FeedbackForm

from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, SECRET_KEY
from models import db, bcrypt, User, Feedback

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = SECRET_KEY

# Initialize extensions with the app
db.init_app(app)
bcrypt.init_app(app)

@app.route("/")
def home():
    return redirect("/register")

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        email = form.email.data
        first = form.first_name.data
        last = form.last_name.data

        user = User.register(username, password, email, first, last)
        db.session.add(user)
        db.session.commit()

        session["username"] = user.username
        return redirect(f"/users/{user.username}")

    return render_template("register.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.authenticate(username, password)

        if user:
            session["username"] = user.username
            return redirect(f"/users/{user.username}")
        else:
            form.username.errors = ["Invalid username or password"]

    return render_template("login.html", form=form)

# @app.route("/secret")
# def secret():
#     if "username" not in session:
#         flash("You must be logged in to view this page.")
#         return redirect("/login")

#     return render_template("secret.html")

@app.route("/users/<username>")
def show_user(username):
    """Show user detail page if logged in as that user."""

    if "username" not in session or session["username"] != username:
        flash("You are not authorized to view that page.")
        return redirect("/login")

    user = User.query.get_or_404(username)

    return render_template("user_detail.html", user=user, feedbacks=user.feedback)

@app.route("/users/<username>/feedback/add", methods=["GET", "POST"])
def add_feedback(username):
    """Add new feedback for logged-in user."""

    if "username" not in session or session["username"] != username:
        flash("Unauthorized.")
        return redirect("/login")

    form = FeedbackForm()

    if form.validate_on_submit():
        print("Form submitted!")
        title = form.title.data
        content = form.content.data

        feedback = Feedback(title=title, content=content, username=username)
        db.session.add(feedback)
        db.session.commit()

        return redirect(f"/users/{username}")

    return render_template("feedback_form.html", form=form)

@app.route("/feedback/<int:feedback_id>/update", methods=["GET", "POST"])
def update_feedback(feedback_id):
    """Update an existing piece of feedback."""

    feedback = Feedback.query.get_or_404(feedback_id)

    if "username" not in session or feedback.username != session["username"]:
        flash("Unauthorized.")
        return redirect("/login")

    form = FeedbackForm(obj=feedback)

    if form.validate_on_submit():
        feedback.title = form.title.data
        feedback.content = form.content.data
        db.session.commit()
        flash("Feedback updated.")
        return redirect(f"/users/{feedback.username}")

    return render_template("edit_feedback.html", form=form, feedback=feedback)

@app.route("/feedback/<int:feedback_id>/delete", methods=["POST"])
def delete_feedback(feedback_id):
    """Delete feedback if user is authorized."""

    feedback = Feedback.query.get_or_404(feedback_id)

    if "username" not in session or feedback.username != session["username"]:
        flash("Unauthorized.")
        return redirect("/login")

    db.session.delete(feedback)
    db.session.commit()
    flash("Feedback deleted.")
    return redirect(f"/users/{feedback.username}")


@app.route("/logout")
def logout():
    """Log out the user and redirect to home."""
    
    session.pop("username", None)
    flash("You have been logged out.")
    return redirect("/")




# Import models *after* extensions are initialized
from models import User

def is_logged_in():
    return "username" in session

