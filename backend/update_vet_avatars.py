import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petkey_api.settings')
django.setup()

from api.models import Veterinarian

# Update veterinarians with avatars
vets = Veterinarian.objects.all()

# Available avatar images in the media folder
avatars = [
    'veterinarians/B2.jfif',
    'veterinarians/DF.png',
    'veterinarians/TÜSEB.png',
    'veterinarians/simpliers-hacettepefenfakultesi.jpg',
]

for i, vet in enumerate(vets):
    # Assign avatars in a round-robin fashion
    avatar_path = avatars[i % len(avatars)]
    vet.avatar = avatar_path
    vet.save()
    print(f'Updated {vet.name} with avatar: {avatar_path}')

print(f'\nTotal {vets.count()} veterinarians updated!')
