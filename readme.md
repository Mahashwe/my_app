# Where Tonight 🍽️

**AI that decides where your friend group is eating — no more “you decide” chaos.**

## Overview

Where Tonight is a simple AI-powered app that helps friend groups quickly decide where to eat. Instead of spending 20+ minutes discussing options in a group chat, everyone privately votes on a few restaurant choices and the system selects the best option automatically.

The goal is to eliminate group decision paralysis and reduce the time it takes to choose a restaurant to under a minute.

## The Problem

Whenever friends plan to eat out, the conversation usually looks like this:

* “Anywhere is fine.”
* “You decide.”
* “I’m okay with anything.”

Even with restaurant discovery apps, groups still struggle to make a final decision. The issue isn’t finding restaurants — it's agreeing on one.

This leads to unnecessary delays and frustration during group plans.

## The Solution

Where Tonight simplifies the process with a quick group voting system.

1. One person creates a session.
2. A shareable link is generated.
3. Friends join using the link.
4. Each person privately swipes **Yes / No** on 5 restaurant options.
5. The system analyzes the responses and selects the best restaurant for the group.

The entire process takes around **60 seconds**.

## Key Features

* Create a session with a shareable link
* Friends join the session instantly
* Private swipe voting on restaurant options
* Automatic decision based on group preferences
* Final result showing the selected restaurant with location and rating

## Tech Stack

**Frontend**

* React Native
* Expo

**Backend**

* Django
* Django REST Framework

**Database**

* SQLite (development)
* PostgreSQL (production)

**APIs**

* Google Places API (restaurant data)
* Groq API (AI-based preference matching)

**Hosting**

* Railway or Render (backend)
* Expo (mobile)

## Repository Structure

```
where-tonight/
│
├── README.md
├── PRD.md
│
├── backend/
│   Django backend application
│
├── frontend/
│   React Native + Expo mobile app
│
└── docs/
    Screenshots, demo gifs, and additional documentation
```

## Purpose of This Project

This project explores how simple AI-driven systems can remove friction from everyday group decisions. Instead of helping users browse endless options, the goal is to help groups reach a decision faster.

## Future Improvements

Possible enhancements include:

* cuisine or dietary filters
* budget preferences
* ranked voting instead of yes/no
* saved friend groups
* restaurant history
* reservation integrations

## License

MIT License
