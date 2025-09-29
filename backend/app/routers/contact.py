from typing import List

from fastapi import APIRouter, BackgroundTasks

from ..models import ContactMessage


router = APIRouter()


# Demo in-memory message store. Replace with email or DB in production.
MESSAGES: List[ContactMessage] = []


def _handle_contact_message(message: ContactMessage) -> None:
	# Placeholder for sending an email/notification or persisting the message
	# In production, integrate with an email service or database here.
	return None


@router.post("/", status_code=201)
def submit_contact(message: ContactMessage, background_tasks: BackgroundTasks) -> dict:
	MESSAGES.append(message)
	background_tasks.add_task(_handle_contact_message, message)
	return {"ok": True}


