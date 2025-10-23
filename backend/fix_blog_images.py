import os
import django
import base64
import uuid
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petkey_api.settings')
django.setup()

from api.models import BlogPost

# Get all blog posts
posts = BlogPost.objects.all()

for post in posts:
    if str(post.featured_image).startswith('data:image'):
        print(f"Converting image for: {post.title}")
        try:
            # Decode base64 image
            img_format, imgstr = str(post.featured_image).split(';base64,')
            ext = img_format.split('/')[-1]
            image_data = ContentFile(base64.b64decode(imgstr), name=f'blog_{uuid.uuid4()}.{ext}')
            post.featured_image = image_data
            post.save()
            print(f"SUCCESS - Converted: {post.featured_image.url}")
        except Exception as e:
            print(f"ERROR converting {post.title}: {e}")

print("\nAll images converted!")
