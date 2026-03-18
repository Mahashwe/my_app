from django.apps import AppConfig


class SessionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'voting_sessions'
    verbose_name = 'Voting Sessions'
