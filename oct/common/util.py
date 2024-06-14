from django.shortcuts import render as _render
from django.conf import settings


def render(req, template, context=None, *args, **kwargs):
    if context is None:
        context = {}
    context["login_url"] = settings.OSU_AUTH_URL+f"&state={req.path}"
    context["is_logged_in"] = req.user.is_authenticated
    context["state"] = req.path
    if req.user.is_authenticated:
        # why not just send the user object... maybe I'll fix it later
        context["avatar_url"] = req.user.osu_avatar
        context["banner"] = req.user.osu_cover
        context["username"] = req.user.osu_username
        context["user_id"] = req.user.osu_id
    return _render(req, template, context, *args, **kwargs)


def enum_field(enum, field):
    def decorator(cls):
        return type(
            cls.__name__,
            (cls, field,),
            {
                "from_db_value": lambda self, value, expression, connection: enum(value) if value is not None else None,
                "to_python": lambda self, value: value if isinstance(value, enum) else enum(value),
                "get_prep_value": lambda self, value: value.value if isinstance(value, enum) else value
            }
        )
    return decorator


def date_to_string(date):
    return f"{date.month}/{date.day}/{str(date.year)[-2:]}"
