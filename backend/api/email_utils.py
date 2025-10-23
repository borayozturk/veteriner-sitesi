"""
Email utility functions for sending appointment and contact confirmations
"""
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


def send_appointment_confirmation(appointment):
    """
    Send appointment confirmation email to the customer

    Args:
        appointment: Appointment model instance

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Prepare context for email template
        context = {
            'name': appointment.name,
            'pet_name': appointment.pet_name,
            'pet_type': appointment.get_pet_type_display(),
            'appointment_date': appointment.date.strftime('%d.%m.%Y'),
            'appointment_time': appointment.time.strftime('%H:%M'),
            'service': appointment.service.title if appointment.service else 'Genel Muayene',
            'email': appointment.email,
            'phone': appointment.phone,
            'notes': appointment.notes or '',
        }

        # Render HTML and text versions
        html_content = render_to_string('emails/appointment_confirmation.html', context)
        text_content = render_to_string('emails/appointment_confirmation.txt', context)

        # Create email
        subject = f'Randevu Onayı - {appointment.pet_name} - PetKey Veteriner'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [appointment.email]

        # Create multipart email (HTML + plain text)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=to_email
        )
        email.attach_alternative(html_content, "text/html")

        # Send email
        email.send(fail_silently=False)

        logger.info(f'Appointment confirmation email sent to {appointment.email} for appointment #{appointment.id}')
        return True

    except Exception as e:
        logger.error(f'Failed to send appointment confirmation email: {str(e)}')
        return False


def send_contact_confirmation(contact_message):
    """
    Send contact form auto-reply confirmation to the customer

    Args:
        contact_message: ContactMessage model instance

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Prepare context for email template
        context = {
            'name': contact_message.name,
            'email': contact_message.email,
            'phone': contact_message.phone,
            'subject': contact_message.subject or 'İletişim',
            'message': contact_message.message,
        }

        # Render HTML and text versions
        html_content = render_to_string('emails/contact_confirmation.html', context)
        text_content = render_to_string('emails/contact_confirmation.txt', context)

        # Create email
        subject = 'Mesajınız Alındı - PetKey Veteriner'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [contact_message.email]

        # Create multipart email (HTML + plain text)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=to_email
        )
        email.attach_alternative(html_content, "text/html")

        # Send email
        email.send(fail_silently=False)

        logger.info(f'Contact confirmation email sent to {contact_message.email} for message #{contact_message.id}')
        return True

    except Exception as e:
        logger.error(f'Failed to send contact confirmation email: {str(e)}')
        return False


def send_admin_notification(subject, message, recipient_email=None):
    """
    Send notification email to admin

    Args:
        subject: Email subject
        message: Email message (plain text)
        recipient_email: Optional recipient email (defaults to ADMIN_EMAIL from settings)

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [recipient_email or settings.ADMIN_EMAIL]

        email = EmailMultiAlternatives(
            subject=f'[PetKey Admin] {subject}',
            body=message,
            from_email=from_email,
            to=to_email
        )

        email.send(fail_silently=False)

        logger.info(f'Admin notification email sent: {subject}')
        return True

    except Exception as e:
        logger.error(f'Failed to send admin notification email: {str(e)}')
        return False
