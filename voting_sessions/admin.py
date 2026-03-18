from django.contrib import admin
from .models import Session, Participant, Vote


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['code', 'creator_name', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['code', 'creator_name']
    readonly_fields = ['code', 'created_at', 'updated_at']


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['name', 'session', 'joined_at']
    list_filter = ['joined_at']
    search_fields = ['name', 'session__code']


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['participant', 'restaurant', 'liked', 'created_at']
    list_filter = ['liked', 'created_at']
    search_fields = ['participant__name', 'restaurant__name']
